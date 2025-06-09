import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { MarketDataService } from '../services/marketDataService';
import { getRedisClient } from '../config/redis';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MarketDataService', () => {
  let mongoServer: MongoMemoryServer;
  let redisClient: any;

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
  });

  describe('getMarketData', () => {
    it('should fetch and cache market data', async () => {
      // 模拟API响应
      mockedAxios.get.mockImplementation((url) => {
        if (url.includes('/stocks')) {
          return Promise.resolve({
            data: {
              valuation: 1.2,
              trend: 'up',
              pe: 16,
              dividend: 2.8
            }
          });
        }
        if (url.includes('/bonds')) {
          return Promise.resolve({
            data: {
              yield: 3.8,
              trend: 'down',
              duration: 4
            }
          });
        }
        if (url.includes('/real-estate')) {
          return Promise.resolve({
            data: {
              priceToRent: 18,
              trend: 'stable',
              capRate: 4.8
            }
          });
        }
        if (url.includes('/economic')) {
          return Promise.resolve({
            data: {
              cycle: 'expansion',
              interestRate: 2.8,
              inflation: 2.2
            }
          });
        }
        return Promise.reject(new Error('Invalid URL'));
      });

      const marketData = await MarketDataService.getMarketData();

      // 验证返回的数据结构
      expect(marketData).toHaveProperty('stocks');
      expect(marketData).toHaveProperty('bonds');
      expect(marketData).toHaveProperty('realEstate');
      expect(marketData).toHaveProperty('economicCycle');
      expect(marketData).toHaveProperty('interestRate');
      expect(marketData).toHaveProperty('inflation');

      // 验证缓存
      const cachedData = await redisClient.get('market:data');
      expect(cachedData).toBeTruthy();
      expect(JSON.parse(cachedData)).toEqual(marketData);
    });

    it('should return cached data when available', async () => {
      // 设置缓存数据
      const mockData = {
        stocks: {
          valuation: 1.2,
          trend: 'up',
          pe: 16,
          dividend: 2.8
        },
        bonds: {
          yield: 3.8,
          trend: 'down',
          duration: 4
        },
        realEstate: {
          priceToRent: 18,
          trend: 'stable',
          capRate: 4.8
        },
        economicCycle: 'expansion',
        interestRate: 2.8,
        inflation: 2.2
      };

      await redisClient.set('market:data', JSON.stringify(mockData), { EX: 3600 });

      const marketData = await MarketDataService.getMarketData();

      // 验证返回的是缓存数据
      expect(marketData).toEqual(mockData);
      // 验证没有调用API
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      // 模拟API错误
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const marketData = await MarketDataService.getMarketData();

      // 验证返回默认值
      expect(marketData.stocks.valuation).toBe(1.0);
      expect(marketData.bonds.yield).toBe(3.5);
      expect(marketData.realEstate.priceToRent).toBe(20);
      expect(marketData.economicCycle).toBe('expansion');
      expect(marketData.interestRate).toBe(2.5);
      expect(marketData.inflation).toBe(2.0);
    });
  });
}); 