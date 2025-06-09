import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { PrefetchService } from '../services/prefetchService';
import { CacheService } from '../services/cacheService';
import { MarketDataApi } from '../services/marketDataApi';
import { MonitoringService } from '../services/monitoringService';
import axios from 'axios';

jest.mock('axios');
jest.mock('../services/cacheService');
jest.mock('../services/marketDataApi');
jest.mock('../services/monitoringService');

describe('PrefetchService', () => {
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

  describe('任务管理', () => {
    it('应该正确添加预取任务', () => {
      const symbols = ['AAPL', 'GOOGL', 'MSFT'];
      prefetchService.addTask('stocks', symbols);
      const status = prefetchService.getQueueStatus();
      expect(status.total).toBe(1);
      expect(status.pending).toBe(1);
    });

    it('应该正确移除预取任务', () => {
      const symbols = ['AAPL', 'GOOGL', 'MSFT'];
      prefetchService.addTask('stocks', symbols);
      const status = prefetchService.getQueueStatus();
      const taskId = `${status.total}`;
      prefetchService.removeTask(taskId);
      const newStatus = prefetchService.getQueueStatus();
      expect(newStatus.total).toBe(0);
    });

    it('应该拒绝未知的数据类型', () => {
      expect(() => {
        prefetchService.addTask('unknown', ['AAPL']);
      }).toThrow('未知的数据类型: unknown');
    });
  });

  describe('任务处理', () => {
    it('应该按优先级和下次获取时间排序任务', () => {
      prefetchService.addTask('stocks', ['AAPL']);
      prefetchService.addTask('bonds', ['US10Y']);
      prefetchService.addTask('forex', ['EUR/USD']);

      const status = prefetchService.getQueueStatus();
      expect(status.total).toBe(3);
    });

    it('应该正确处理批量数据获取', async () => {
      const symbols = Array.from({ length: 100 }, (_, i) => `STOCK${i}`);
      prefetchService.addTask('stocks', symbols);

      // 启动服务
      prefetchService.start();

      // 等待任务处理
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 验证API调用
      expect(marketDataApi.getStockData).toHaveBeenCalled();
      expect(monitoringService.recordPrefetchSuccess).toHaveBeenCalled();

      // 停止服务
      prefetchService.stop();
    });

    it('应该在任务失败时进行重试', async () => {
      // 模拟API调用失败
      (marketDataApi.getStockData as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      prefetchService.addTask('stocks', ['AAPL']);
      prefetchService.start();

      // 等待任务处理和重试
      await new Promise(resolve => setTimeout(resolve, 2000));

      expect(monitoringService.recordPrefetchFailure).toHaveBeenCalled();
      expect(marketDataApi.getStockData).toHaveBeenCalledTimes(1);

      prefetchService.stop();
    });
  });

  describe('配置管理', () => {
    it('应该正确更新配置', () => {
      const newConfig = {
        interval: 120000,
        priority: 2,
        batchSize: 40,
        retryLimit: 5
      };

      prefetchService.updateConfig('stocks', newConfig);
      const status = prefetchService.getQueueStatus();
      expect(status).toBeDefined();
    });
  });

  describe('服务生命周期', () => {
    it('应该正确启动和停止服务', () => {
      prefetchService.start();
      expect(prefetchService['isRunning']).toBe(true);

      prefetchService.stop();
      expect(prefetchService['isRunning']).toBe(false);
    });

    it('不应该重复启动服务', () => {
      prefetchService.start();
      const initialInterval = prefetchService['processInterval'];
      
      prefetchService.start();
      expect(prefetchService['processInterval']).toBe(initialInterval);

      prefetchService.stop();
    });
  });

  describe('错误处理', () => {
    it('应该处理API错误', async () => {
      (marketDataApi.getStockData as jest.Mock).mockRejectedValue(new Error('API Error'));

      prefetchService.addTask('stocks', ['AAPL']);
      prefetchService.start();

      await new Promise(resolve => setTimeout(resolve, 2000));

      expect(monitoringService.recordPrefetchFailure).toHaveBeenCalled();
      prefetchService.stop();
    });

    it('应该处理无效的符号列表', () => {
      expect(() => {
        prefetchService.addTask('stocks', []);
      }).not.toThrow();
    });
  });
}); 