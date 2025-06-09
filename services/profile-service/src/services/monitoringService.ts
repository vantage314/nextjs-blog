import { logger } from '../utils/logger';
import { CacheService } from './cacheService';
import { WebSocketService } from './websocketService';
import { EventEmitter } from 'events';
import { performance } from 'perf_hooks';
import os from 'os';

interface PerformanceMetrics {
  timestamp: number;
  apiLatency: { [key: string]: number };
  cacheHitRate: number;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
  wsConnections: {
    total: number;
    active: number;
    dropped: number;
  };
  dataUpdates: {
    total: number;
    success: number;
    failed: number;
  };
  systemMetrics: {
    cpu: {
      usage: number;
      loadAvg: number[];
    };
    memory: {
      total: number;
      free: number;
      used: number;
      usagePercent: number;
    };
    disk: {
      total: number;
      free: number;
      used: number;
      usagePercent: number;
    };
    network: {
      bytesIn: number;
      bytesOut: number;
      connections: number;
    };
  };
  businessMetrics: {
    activeUsers: number;
    requestsPerMinute: number;
    errorRate: number;
    averageResponseTime: number;
    dataVolume: {
      total: number;
      cached: number;
      realtime: number;
    };
    prefetchMetrics: {
      totalTasks: number;
      successRate: number;
      averageLatency: number;
    };
  };
}

interface AlertRule {
  id: string;
  name: string;
  condition: (metrics: PerformanceMetrics) => boolean;
  severity: 'info' | 'warning' | 'error';
  message: string;
}

export class MonitoringService extends EventEmitter {
  private static instance: MonitoringService;
  private metrics: PerformanceMetrics | undefined = undefined;
  private alertRules: AlertRule[] = [];
  private cacheService: CacheService;
  private wsService: WebSocketService;
  private updateInterval: NodeJS.Timeout | undefined = undefined;
  private readonly ALERT_CHANNEL = 'monitoring:alerts';
  private readonly METRICS_CHANNEL = 'monitoring:metrics';
  private lastNetworkStats: { bytesIn: number; bytesOut: number } = { bytesIn: 0, bytesOut: 0 };
  private isRunning: boolean = false;

  private constructor() {
    super();
    this.cacheService = CacheService.getInstance();
    this.wsService = WebSocketService.getInstance();
    this.initializeAlertRules();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private initializeAlertRules() {
    this.alertRules = [
      {
        id: 'high_latency',
        name: 'API延迟过高',
        condition: (metrics) => {
          const avgLatency = Object.values(metrics.apiLatency).reduce((a, b) => a + b, 0) / 
            Object.keys(metrics.apiLatency).length;
          return avgLatency > 1000;
        },
        severity: 'warning',
        message: 'API平均响应时间超过1秒'
      },
      {
        id: 'low_cache_hit',
        name: '缓存命中率过低',
        condition: (metrics) => metrics.cacheHitRate < 0.5,
        severity: 'warning',
        message: '缓存命中率低于50%'
      },
      {
        id: 'high_memory_usage',
        name: '内存使用率过高',
        condition: (metrics) => {
          const memoryUsage = metrics.memoryUsage.heapUsed / metrics.memoryUsage.heapTotal;
          return memoryUsage > 0.8;
        },
        severity: 'error',
        message: '内存使用率超过80%'
      },
      {
        id: 'high_cpu_usage',
        name: 'CPU使用率过高',
        condition: (metrics) => metrics.systemMetrics.cpu.usage > 0.8,
        severity: 'error',
        message: 'CPU使用率超过80%'
      },
      {
        id: 'high_disk_usage',
        name: '磁盘使用率过高',
        condition: (metrics) => metrics.systemMetrics.disk.usagePercent > 0.9,
        severity: 'error',
        message: '磁盘使用率超过90%'
      },
      {
        id: 'high_error_rate',
        name: '错误率过高',
        condition: (metrics) => metrics.businessMetrics.errorRate > 0.05,
        severity: 'error',
        message: '错误率超过5%'
      }
    ];
  }

  public async start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // 初始化指标
    this.metrics = {
      timestamp: Date.now(),
      systemMetrics: {
        cpu: {
          usage: 0,
          loadAvg: [0, 0, 0]
        },
        memory: {
          total: 0,
          free: 0,
          used: 0,
          usagePercent: 0
        },
        disk: {
          total: 0,
          free: 0,
          used: 0,
          usagePercent: 0
        },
        network: {
          bytesIn: 0,
          bytesOut: 0,
          connections: 0
        }
      },
      memoryUsage: {
        heapUsed: 0,
        heapTotal: 0,
        external: 0,
        rss: 0
      },
      wsConnections: {
        total: 0,
        active: 0,
        dropped: 0
      },
      dataUpdates: {
        success: 0,
        failed: 0,
        total: 0
      },
      apiLatency: {},
      cacheHitRate: 0,
      businessMetrics: {
        activeUsers: 0,
        requestsPerMinute: 0,
        errorRate: 0,
        averageResponseTime: 0,
        dataVolume: {
          total: 0,
          cached: 0,
          realtime: 0
        },
        prefetchMetrics: {
          totalTasks: 0,
          successRate: 0,
          averageLatency: 0
        }
      }
    };

    // 启动定时任务
    this.startPeriodicTasks();

    // 订阅告警通道
    await this.subscribeToAlerts();

    logger.info('监控服务已启动');
  }

  private startPeriodicTasks() {
    this.updateInterval = setInterval(() => {
      this.updateMetrics();
      this.checkAlerts();
      this.broadcastMetrics();
    }, 60000);
  }

  private async updateMetrics() {
    const now = Date.now();
    if (!this.metrics) return;
    const metrics = this.metrics;
    metrics.timestamp = now;

    // 更新系统指标
    this.updateSystemMetrics();

    // 更新内存使用情况
    const memoryUsage = process.memoryUsage();
    metrics.memoryUsage = {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      external: memoryUsage.external,
      rss: memoryUsage.rss
    };

    // 更新WebSocket连接统计
    const wsStats = this.wsService.getConnectionStats();
    metrics.wsConnections = {
      total: wsStats.total,
      active: wsStats.active,
      dropped: wsStats.dropped
    };

    // 更新缓存命中率
    const cacheStats = await this.cacheService.getStats();
    metrics.cacheHitRate = cacheStats.hitRate;

    // 保存指标到Redis
    await this.cacheService.set(
      `metrics:${now}`,
      metrics,
      3600
    );
  }

  private updateSystemMetrics() {
    if (!this.metrics) return;
    const metrics = this.metrics;
    // CPU使用率
    const cpus = os.cpus();
    const totalCpuTime = cpus.reduce((acc, cpu) => {
      return acc + Object.values(cpu.times).reduce((a, b) => a + b, 0);
    }, 0);
    const idleCpuTime = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    metrics.systemMetrics.cpu.usage = 1 - (idleCpuTime / totalCpuTime);
    metrics.systemMetrics.cpu.loadAvg = os.loadavg();

    // 内存使用情况
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    metrics.systemMetrics.memory = {
      total: totalMem,
      free: freeMem,
      used: totalMem - freeMem,
      usagePercent: (totalMem - freeMem) / totalMem
    };

    // 网络统计
    const networkStats = this.getNetworkStats();
    metrics.systemMetrics.network = {
      bytesIn: networkStats.bytesIn - this.lastNetworkStats.bytesIn,
      bytesOut: networkStats.bytesOut - this.lastNetworkStats.bytesOut,
      connections: this.getActiveConnections()
    };
    this.lastNetworkStats = networkStats;
  }

  private getNetworkStats() {
    // 这里需要根据操作系统实现具体的网络统计获取逻辑
    return {
      bytesIn: 0,
      bytesOut: 0
    };
  }

  private getActiveConnections() {
    // 这里需要实现获取活动连接数的逻辑
    return 0;
  }

  private checkAlerts() {
    if (!this.metrics) return;
    const metrics = this.metrics;
    this.alertRules.forEach(rule => {
      if (rule.condition(metrics)) {
        this.emitAlert(rule);
      }
    });
  }

  private emitAlert(rule: AlertRule) {
    if (!this.metrics) return;
    const metrics = this.metrics;
    const alert = {
      ...rule,
      timestamp: Date.now(),
      metrics
    };

    this.cacheService.publish(this.ALERT_CHANNEL, JSON.stringify(alert));
    logger[rule.severity](`监控告警: ${rule.message}`, {
      rule: rule.id,
      metrics
    });
  }

  private broadcastMetrics() {
    if (!this.metrics) return;
    const metrics = this.metrics;
    this.wsService.broadcast({
      type: 'metrics',
      data: metrics,
      timestamp: Date.now()
    });
  }

  public async recordApiLatency(api: string, startTime: number) {
    if (!this.metrics) return;
    const latency = performance.now() - startTime;
    this.metrics.apiLatency[api] = latency;
  }

  public async recordCacheHit() {
    if (!this.metrics) return;
    const metrics = this.metrics;
    metrics.dataUpdates.success++;
    metrics.dataUpdates.total++;
  }

  public async recordCacheMiss() {
    if (!this.metrics) return;
    this.metrics.dataUpdates.failed++;
    this.metrics.dataUpdates.total++;
  }

  public async recordWsConnection() {
    if (!this.metrics) return;
    const metrics = this.metrics;
    metrics.wsConnections.total++;
    metrics.wsConnections.active++;
  }

  public async recordWsDisconnection() {
    if (!this.metrics) return;
    const metrics = this.metrics;
    metrics.wsConnections.active--;
  }

  public async recordWsDrop() {
    if (!this.metrics) return;
    const metrics = this.metrics;
    metrics.wsConnections.dropped++;
  }

  public async recordWsError() {
    if (!this.metrics) return;
    const metrics = this.metrics;
    metrics.businessMetrics.errorRate = 
      metrics.dataUpdates.failed / metrics.dataUpdates.total;
  }

  public async recordPrefetchSuccess(type: string) {
    if (!this.metrics) return;
    const metrics = this.metrics;
    metrics.businessMetrics.prefetchMetrics.totalTasks++;
    metrics.businessMetrics.prefetchMetrics.successRate = 
      metrics.businessMetrics.prefetchMetrics.totalTasks / 
      (metrics.businessMetrics.prefetchMetrics.totalTasks + 1);
  }

  public async recordPrefetchFailure(type: string) {
    if (!this.metrics) return;
    const metrics = this.metrics;
    metrics.businessMetrics.prefetchMetrics.totalTasks++;
    metrics.businessMetrics.prefetchMetrics.successRate = 
      metrics.businessMetrics.prefetchMetrics.totalTasks / 
      (metrics.businessMetrics.prefetchMetrics.totalTasks + 1);
  }

  public getMetrics(): PerformanceMetrics {
    if (!this.metrics) throw new Error('Metrics not initialized');
    return this.metrics;
  }

  public getAlertRules(): AlertRule[] {
    return this.alertRules;
  }

  public addAlertRule(rule: AlertRule) {
    this.alertRules.push(rule);
  }

  public removeAlertRule(ruleId: string) {
    this.alertRules = this.alertRules.filter(rule => rule.id !== ruleId);
  }

  public stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private async subscribeToAlerts() {
    this.cacheService.subscribe(this.ALERT_CHANNEL, (message: string) => {
      try {
        const alert = JSON.parse(message);
        logger.warn(`收到告警: ${alert.message}`, {
          rule: alert.id,
          metrics: alert.metrics
        });
      } catch (error) {
        logger.error('处理告警消息失败', { error });
      }
    });
  }
} 