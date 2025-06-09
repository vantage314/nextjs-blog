import { logger } from '../utils/logger';
import { CacheService } from './cacheService';
import { MarketDataApi } from './marketDataApi';
import { MonitoringService } from './monitoringService';

interface PrefetchTask {
  id: string;
  type: string;
  symbols: string[];
  priority: number;
  lastFetch: number;
  nextFetch: number;
  retryCount: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  successCount: number;
  failureCount: number;
  averageLatency: number;
  lastError?: string;
}

interface PrefetchConfig {
  type: string;
  interval: number;
  priority: number;
  batchSize: number;
  retryLimit: number;
  minInterval: number;
  maxInterval: number;
  adaptiveInterval: boolean;
  successThreshold: number;
  failureThreshold: number;
}

interface PrefetchStats {
  totalTasks: number;
  successRate: number;
  averageLatency: number;
  lastUpdate: number;
  errorRate: number;
}

export class PrefetchService {
  private static instance: PrefetchService;
  private cacheService: CacheService;
  private marketDataApi: MarketDataApi;
  private monitoringService: MonitoringService;
  private taskQueue: PrefetchTask[];
  private configs: Map<string, PrefetchConfig>;
  private stats: Map<string, PrefetchStats>;
  private isRunning: boolean;
  private processInterval: NodeJS.Timeout;
  private readonly DEFAULT_BATCH_SIZE = 50;
  private readonly MAX_BATCH_SIZE = 200;
  private readonly MIN_BATCH_SIZE = 10;
  private readonly ADAPTIVE_INTERVAL_FACTOR = 0.8;
  private readonly MAX_RETRY_DELAY = 300000; // 5分钟

  private constructor() {
    this.cacheService = CacheService.getInstance();
    this.marketDataApi = MarketDataApi.getInstance();
    this.monitoringService = MonitoringService.getInstance();
    this.taskQueue = [];
    this.stats = new Map();
    this.isRunning = false;
    this.initializeConfigs();
  }

  public static getInstance(): PrefetchService {
    if (!PrefetchService.instance) {
      PrefetchService.instance = new PrefetchService();
    }
    return PrefetchService.instance;
  }

  private initializeConfigs() {
    this.configs = new Map([
      ['stocks', {
        type: 'stocks',
        interval: 300000, // 5分钟
        priority: 1,
        batchSize: this.DEFAULT_BATCH_SIZE,
        retryLimit: 3,
        minInterval: 60000, // 1分钟
        maxInterval: 900000, // 15分钟
        adaptiveInterval: true,
        successThreshold: 0.95,
        failureThreshold: 0.1
      }],
      ['bonds', {
        type: 'bonds',
        interval: 600000, // 10分钟
        priority: 2,
        batchSize: 20,
        retryLimit: 3,
        minInterval: 300000, // 5分钟
        maxInterval: 1800000, // 30分钟
        adaptiveInterval: true,
        successThreshold: 0.95,
        failureThreshold: 0.1
      }],
      ['forex', {
        type: 'forex',
        interval: 60000, // 1分钟
        priority: 1,
        batchSize: 30,
        retryLimit: 3,
        minInterval: 30000, // 30秒
        maxInterval: 300000, // 5分钟
        adaptiveInterval: true,
        successThreshold: 0.95,
        failureThreshold: 0.1
      }],
      ['futures', {
        type: 'futures',
        interval: 60000, // 1分钟
        priority: 1,
        batchSize: 30,
        retryLimit: 3,
        minInterval: 30000, // 30秒
        maxInterval: 300000, // 5分钟
        adaptiveInterval: true,
        successThreshold: 0.95,
        failureThreshold: 0.1
      }],
      ['options', {
        type: 'options',
        interval: 300000, // 5分钟
        priority: 2,
        batchSize: 20,
        retryLimit: 3,
        minInterval: 120000, // 2分钟
        maxInterval: 600000, // 10分钟
        adaptiveInterval: true,
        successThreshold: 0.95,
        failureThreshold: 0.1
      }],
      ['industry', {
        type: 'industry',
        interval: 300000, // 5分钟
        priority: 3,
        batchSize: 10,
        retryLimit: 3,
        minInterval: 300000, // 5分钟
        maxInterval: 1800000, // 30分钟
        adaptiveInterval: true,
        successThreshold: 0.95,
        failureThreshold: 0.1
      }]
    ]);
  }

  public start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.processInterval = setInterval(() => {
        this.processQueue();
      }, 1000);
      logger.info('预取服务已启动');
    }
  }

  public stop() {
    if (this.isRunning) {
      this.isRunning = false;
      if (this.processInterval) {
        clearInterval(this.processInterval);
      }
      logger.info('预取服务已停止');
    }
  }

  private async processQueue() {
    if (this.taskQueue.length === 0) {
      return;
    }

    // 按优先级和下次获取时间排序
    this.taskQueue.sort((a, b) => {
      if (a.nextFetch !== b.nextFetch) {
        return a.nextFetch - b.nextFetch;
      }
      return a.priority - b.priority;
    });

    const now = Date.now();
    const tasksToProcess = this.taskQueue.filter(task => 
      task.status === 'pending' && task.nextFetch <= now
    );

    for (const task of tasksToProcess) {
      await this.processTask(task);
    }
  }

  private async processTask(task: PrefetchTask) {
    try {
      task.status = 'running';
      const config = this.configs.get(task.type);
      if (!config) {
        throw new Error(`未知的数据类型: ${task.type}`);
      }

      const startTime = Date.now();
      const batches = this.createBatches(task.symbols, this.calculateBatchSize(task.type));
      
      for (const batch of batches) {
        await this.fetchData(task.type, batch);
      }

      const latency = Date.now() - startTime;
      this.updateTaskStats(task, true, latency);
      this.updateTypeStats(task.type, true, latency);

      task.status = 'completed';
      task.lastFetch = Date.now();
      task.nextFetch = this.calculateNextFetchTime(task, config);
      task.retryCount = 0;

      this.monitoringService.recordPrefetchSuccess(task.type);
    } catch (error) {
      logger.error('预取任务执行失败:', error);
      this.updateTaskStats(task, false);
      this.updateTypeStats(task.type, false);

      task.status = 'failed';
      task.retryCount++;
      task.lastError = error.message;

      if (task.retryCount < config.retryLimit) {
        task.nextFetch = this.calculateRetryTime(task);
      } else {
        this.taskQueue = this.taskQueue.filter(t => t.id !== task.id);
      }

      this.monitoringService.recordPrefetchFailure(task.type);
    }
  }

  private calculateBatchSize(type: string): number {
    const config = this.configs.get(type);
    if (!config) return this.DEFAULT_BATCH_SIZE;

    const stats = this.stats.get(type);
    if (!stats) return config.batchSize;

    // 根据成功率动态调整批处理大小
    if (stats.successRate >= config.successThreshold) {
      return Math.min(config.batchSize * 1.2, this.MAX_BATCH_SIZE);
    } else if (stats.successRate < config.failureThreshold) {
      return Math.max(config.batchSize * 0.8, this.MIN_BATCH_SIZE);
    }

    return config.batchSize;
  }

  private calculateNextFetchTime(task: PrefetchTask, config: PrefetchConfig): number {
    if (!config.adaptiveInterval) {
      return task.lastFetch + config.interval;
    }

    const stats = this.stats.get(task.type);
    if (!stats) return task.lastFetch + config.interval;

    // 根据成功率动态调整间隔
    let interval = config.interval;
    if (stats.successRate >= config.successThreshold) {
      interval = Math.min(interval * 1.2, config.maxInterval);
    } else if (stats.successRate < config.failureThreshold) {
      interval = Math.max(interval * 0.8, config.minInterval);
    }

    return task.lastFetch + interval;
  }

  private calculateRetryTime(task: PrefetchTask): number {
    const baseDelay = Math.min(
      this.INITIAL_RECONNECT_DELAY * Math.pow(2, task.retryCount),
      this.MAX_RETRY_DELAY
    );
    return Date.now() + baseDelay + Math.random() * 1000;
  }

  private updateTaskStats(task: PrefetchTask, success: boolean, latency?: number) {
    if (success) {
      task.successCount++;
      if (latency) {
        task.averageLatency = (task.averageLatency * (task.successCount - 1) + latency) / task.successCount;
      }
    } else {
      task.failureCount++;
    }
  }

  private updateTypeStats(type: string, success: boolean, latency?: number) {
    const stats = this.stats.get(type) || {
      totalTasks: 0,
      successRate: 1,
      averageLatency: 0,
      lastUpdate: Date.now(),
      errorRate: 0
    };

    stats.totalTasks++;
    if (success) {
      stats.successRate = (stats.successRate * (stats.totalTasks - 1) + 1) / stats.totalTasks;
      if (latency) {
        stats.averageLatency = (stats.averageLatency * (stats.totalTasks - 1) + latency) / stats.totalTasks;
      }
    } else {
      stats.successRate = (stats.successRate * (stats.totalTasks - 1)) / stats.totalTasks;
      stats.errorRate = 1 - stats.successRate;
    }

    stats.lastUpdate = Date.now();
    this.stats.set(type, stats);
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private async fetchData(type: string, symbols: string[]) {
    switch (type) {
      case 'stocks':
        await this.marketDataApi.getStockData(symbols);
        break;
      case 'bonds':
        await this.marketDataApi.getBondData(symbols);
        break;
      case 'forex':
        await this.marketDataApi.getForexData(symbols);
        break;
      case 'futures':
        await this.marketDataApi.getFuturesData(symbols);
        break;
      case 'options':
        for (const symbol of symbols) {
          await this.marketDataApi.getOptionsData(symbol);
        }
        break;
      case 'industry':
        await this.marketDataApi.getIndustryIndices();
        break;
      default:
        throw new Error(`未知的数据类型: ${type}`);
    }
  }

  public addTask(type: string, symbols: string[]) {
    const config = this.configs.get(type);
    if (!config) {
      throw new Error(`未知的数据类型: ${type}`);
    }

    const task: PrefetchTask = {
      id: `${type}_${Date.now()}`,
      type,
      symbols,
      priority: config.priority,
      lastFetch: 0,
      nextFetch: Date.now(),
      retryCount: 0,
      status: 'pending',
      successCount: 0,
      failureCount: 0,
      averageLatency: 0
    };

    this.taskQueue.push(task);
    logger.info('添加预取任务:', { type, symbols: symbols.length });
  }

  public removeTask(taskId: string) {
    this.taskQueue = this.taskQueue.filter(task => task.id !== taskId);
  }

  public getQueueStatus() {
    return {
      total: this.taskQueue.length,
      pending: this.taskQueue.filter(t => t.status === 'pending').length,
      running: this.taskQueue.filter(t => t.status === 'running').length,
      completed: this.taskQueue.filter(t => t.status === 'completed').length,
      failed: this.taskQueue.filter(t => t.status === 'failed').length
    };
  }

  public getTypeStats(type: string): PrefetchStats | undefined {
    return this.stats.get(type);
  }

  public updateConfig(type: string, config: Partial<PrefetchConfig>) {
    const existingConfig = this.configs.get(type);
    if (existingConfig) {
      this.configs.set(type, { ...existingConfig, ...config });
    }
  }
} 