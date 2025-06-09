import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { RealtimeMarketService } from '../services/realtimeMarketService';
import { WebSocketService } from '../services/websocketService';
import { getRedisClient } from '../config/redis';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RealtimeMarketService', () => {
  let mongoServer: MongoMemoryServer;
  let redisClient: any;
  let wsService: WebSocketService;
  let marketService: RealtimeMarketService;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    redisClient = getRedisClient();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await redisClient.quit();
  });

  beforeEach(async () => {
    await redisClient.flushAll();
    jest.clearAllMocks();
    jest.useFakeTimers();

    // 创建WebSocket服务实例
    wsService = WebSocketService.getInstance({} as any);
    marketService = RealtimeMarketService.getInstance(wsService);
  });

  afterEach(() => {
    jest.useRealTimers();
    marketService.stop();
  });

  describe('start', () => {
    it('should start updating market data every 5 seconds', async () => {
      // 设置订阅数据
      await redisClient.sadd('subscription:stock', 'AAPL', 'GOOGL');
      await redisClient.sadd('subscription:bond', 'US10Y', 'US30Y');
      await redisClient.sadd('subscription:economic', 'GDP', 'CPI');

      // 模拟API响应
      mockedAxios.get.mockImplementation((url) => {
        if (url.includes('/stocks')) {
          return Promise.resolve({
            data: [
              {
                symbol: 'AAPL',
                price: 150.0,
                change: 1.5,
                changePercent: 1.0,
                volume: 1000000,
                timestamp: Date.now()
              }
            ]
          });
        }
        return Promise.resolve({ data: [] });
      });

      // 启动服务
      await marketService.start();

      // 快进5秒
      jest.advanceTimersByTime(5000);

      // 验证API调用
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop updating market data', async () => {
      await marketService.start();
      marketService.stop();

      // 快进5秒
      jest.advanceTimersByTime(5000);

      // 验证没有API调用
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });
  });

  describe('fetchStockData', () => {
    it('should fetch and cache stock data', async () => {
      const mockData = [
        {
          symbol: 'AAPL',
          price: 150.0,
          change: 1.5,
          changePercent: 1.0,
          volume: 1000000,
          timestamp: Date.now()
        }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await (marketService as any).fetchStockData(['AAPL']);

      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const result = await (marketService as any).fetchStockData(['AAPL']);

      expect(result).toEqual([]);
    });
  });

  describe('fetchBondData', () => {
    it('should fetch and cache bond data', async () => {
      const mockData = [
        {
          symbol: 'US10Y',
          yield: 3.5,
          change: 0.1,
          changePercent: 2.9,
          timestamp: Date.now()
        }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await (marketService as any).fetchBondData(['US10Y']);

      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const result = await (marketService as any).fetchBondData(['US10Y']);

      expect(result).toEqual([]);
    });
  });

  describe('fetchEconomicData', () => {
    it('should fetch and cache economic data', async () => {
      const mockData = [
        {
          indicator: 'GDP',
          value: 2.5,
          change: 0.1,
          changePercent: 4.2,
          timestamp: Date.now()
        }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await (marketService as any).fetchEconomicData(['GDP']);

      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const result = await (marketService as any).fetchEconomicData(['GDP']);

      expect(result).toEqual([]);
    });
  });
}); 