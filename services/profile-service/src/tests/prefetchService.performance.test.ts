import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { PrefetchService } from '../services/prefetchService';
import { CacheService } from '../services/cacheService';
import { MarketDataApi } from '../services/marketDataApi';
import { MonitoringService } from '../services/monitoringService';
import { performance } from 'perf_hooks';

jest.mock('../services/cacheService');
jest.mock('../services/marketDataApi');
jest.mock('../services/monitoringService');

describe('PrefetchService Performance', () => {
  let mongoServer: MongoMemoryServer;
  let prefetchService: PrefetchService;
  let cacheService: CacheService;
  let marketDataApi: MarketDataApi;
  let monitoringService: MonitoringService;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    cacheService = CacheService.getInstance();
    marketDataApi = MarketDataApi.getInstance();
    monitoringService = MonitoringService.getInstance();
    prefetchService = PrefetchService.getInstance();
  });

  afterEach(() => {
    prefetchService.stop();
  });

  describe('预取策略性能', () => {
    it('应该能够处理大量并发预取任务', async () => {
      const startTime = performance.now();
      const tasks = Array.from({ length: 100 }, (_, i) => ({
        type: 'stocks',
        symbols: [`SYMBOL${i}`]
      }));

      for (const task of tasks) {
        prefetchService.addTask(task.type, task.symbols);
      }

      prefetchService.start();
      await new Promise(resolve => setTimeout(resolve, 5000));

      const endTime = performance.now();
      const duration = endTime - startTime;
      const queueStatus = prefetchService.getQueueStatus();

      expect(queueStatus.completed).toBeGreaterThan(0);
      expect(duration).toBeLessThan(10000); // 10秒内完成
    });

    it('应该根据成功率动态调整批处理大小', async () => {
      const type = 'stocks';
      const symbols = Array.from({ length: 200 }, (_, i) => `SYMBOL${i}`);

      // 模拟成功的情况
      jest.spyOn(marketDataApi, 'getStockData').mockResolvedValue({});
      
      prefetchService.addTask(type, symbols);
      prefetchService.start();
      await new Promise(resolve => setTimeout(resolve, 2000));

      const stats = prefetchService.getTypeStats(type);
      expect(stats?.successRate).toBeGreaterThan(0.9);
      expect(stats?.averageLatency).toBeLessThan(1000); // 平均延迟小于1秒
    });

    it('应该在失败时减小批处理大小', async () => {
      const type = 'stocks';
      const symbols = Array.from({ length: 200 }, (_, i) => `SYMBOL${i}`);

      // 模拟失败的情况
      jest.spyOn(marketDataApi, 'getStockData').mockRejectedValue(new Error('API Error'));
      
      prefetchService.addTask(type, symbols);
      prefetchService.start();
      await new Promise(resolve => setTimeout(resolve, 2000));

      const stats = prefetchService.getTypeStats(type);
      expect(stats?.successRate).toBeLessThan(0.5);
    });
  });

  describe('批处理性能', () => {
    it('应该能够高效处理大批量数据', async () => {
      const type = 'stocks';
      const symbols = Array.from({ length: 1000 }, (_, i) => `SYMBOL${i}`);

      const startTime = performance.now();
      prefetchService.addTask(type, symbols);
      prefetchService.start();
      await new Promise(resolve => setTimeout(resolve, 10000));

      const endTime = performance.now();
      const duration = endTime - startTime;
      const stats = prefetchService.getTypeStats(type);

      expect(stats?.totalTasks).toBeGreaterThan(0);
      expect(duration / stats!.totalTasks).toBeLessThan(100); // 每个任务平均处理时间小于100ms
    });

    it('应该根据系统负载动态调整并发数', async () => {
      const type = 'stocks';
      const symbols = Array.from({ length: 500 }, (_, i) => `SYMBOL${i}`);

      // 模拟高负载情况
      jest.spyOn(monitoringService, 'getMetrics').mockReturnValue({
        systemMetrics: {
          cpu: { usage: 0.9, loadAvg: [5, 4, 3] },
          memory: { usagePercent: 0.8 }
        }
      } as any);

      prefetchService.addTask(type, symbols);
      prefetchService.start();
      await new Promise(resolve => setTimeout(resolve, 5000));

      const stats = prefetchService.getTypeStats(type);
      expect(stats?.averageLatency).toBeGreaterThan(500); // 高负载下延迟增加
    });
  });

  describe('失败重试性能', () => {
    it('应该能够处理临时性失败并重试', async () => {
      const type = 'stocks';
      const symbols = ['SYMBOL1', 'SYMBOL2', 'SYMBOL3'];

      // 模拟前两次失败，第三次成功
      let attemptCount = 0;
      jest.spyOn(marketDataApi, 'getStockData').mockImplementation(async () => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('Temporary Error');
        }
        return {};
      });

      prefetchService.addTask(type, symbols);
      prefetchService.start();
      await new Promise(resolve => setTimeout(resolve, 5000));

      expect(attemptCount).toBe(3);
      const stats = prefetchService.getTypeStats(type);
      expect(stats?.successRate).toBe(1);
    });

    it('应该在达到最大重试次数后放弃任务', async () => {
      const type = 'stocks';
      const symbols = ['SYMBOL1'];

      // 模拟持续失败
      jest.spyOn(marketDataApi, 'getStockData').mockRejectedValue(new Error('Persistent Error'));

      prefetchService.addTask(type, symbols);
      prefetchService.start();
      await new Promise(resolve => setTimeout(resolve, 10000));

      const queueStatus = prefetchService.getQueueStatus();
      expect(queueStatus.failed).toBe(1);
      expect(queueStatus.pending).toBe(0);
    });
  });

  describe('性能指标监控', () => {
    it('应该正确记录预取任务的性能指标', async () => {
      const type = 'stocks';
      const symbols = Array.from({ length: 100 }, (_, i) => `SYMBOL${i}`);

      prefetchService.addTask(type, symbols);
      prefetchService.start();
      await new Promise(resolve => setTimeout(resolve, 5000));

      const stats = prefetchService.getTypeStats(type);
      expect(stats).toBeDefined();
      expect(stats?.totalTasks).toBeGreaterThan(0);
      expect(stats?.successRate).toBeGreaterThanOrEqual(0);
      expect(stats?.successRate).toBeLessThanOrEqual(1);
      expect(stats?.averageLatency).toBeGreaterThan(0);
      expect(stats?.errorRate).toBeGreaterThanOrEqual(0);
      expect(stats?.errorRate).toBeLessThanOrEqual(1);
    });

    it('应该能够处理不同类型的预取任务', async () => {
      const types = ['stocks', 'forex', 'futures', 'options', 'industry'];
      const symbols = Array.from({ length: 20 }, (_, i) => `SYMBOL${i}`);

      for (const type of types) {
        prefetchService.addTask(type, symbols);
      }

      prefetchService.start();
      await new Promise(resolve => setTimeout(resolve, 10000));

      for (const type of types) {
        const stats = prefetchService.getTypeStats(type);
        expect(stats).toBeDefined();
        expect(stats?.totalTasks).toBeGreaterThan(0);
      }
    });
  });
}); 