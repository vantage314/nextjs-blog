import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import axios from 'axios';
import { MarketDataApi } from '../services/marketDataApi';
import { CacheService } from '../services/cacheService';
import { MonitoringService } from '../services/monitoringService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MarketDataApi', () => {
  let mongoServer: MongoMemoryServer;
  let marketDataApi: MarketDataApi;
  let cacheService: CacheService;
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
    marketDataApi = MarketDataApi.getInstance();
    cacheService = CacheService.getInstance();
    monitoringService = MonitoringService.getInstance();
  });

  describe('getStockData', () => {
    it('应该从缓存返回数据', async () => {
      const mockData = [
        {
          symbol: 'AAPL',
          price: 150.0,
          change: 2.5,
          changePercent: 1.67,
          volume: 1000000,
          marketCap: 2500000000000,
          peRatio: 25.5,
          dividendYield: 0.6
        }
      ];

      await cacheService.set('stocks:AAPL', mockData);
      const result = await marketDataApi.getStockData(['AAPL']);
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('应该从API获取数据并缓存', async () => {
      const mockData = [
        {
          symbol: 'AAPL',
          price: 150.0,
          change: 2.5,
          changePercent: 1.67,
          volume: 1000000,
          marketCap: 2500000000000,
          peRatio: 25.5,
          dividendYield: 0.6
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });
      const result = await marketDataApi.getStockData(['AAPL']);
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/stocks'),
        expect.any(Object)
      );
    });

    it('应该在API错误时返回空数组', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
      const result = await marketDataApi.getStockData(['AAPL']);
      expect(result).toEqual([]);
    });
  });

  describe('getBondData', () => {
    it('应该从缓存返回数据', async () => {
      const mockData = [
        {
          symbol: 'US10Y',
          yield: 3.5,
          price: 98.5,
          duration: 8.5,
          coupon: 3.0,
          maturity: '2033-05-15',
          rating: 'AAA'
        }
      ];

      await cacheService.set('bonds:US10Y', mockData);
      const result = await marketDataApi.getBondData(['US10Y']);
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('应该从API获取数据并缓存', async () => {
      const mockData = [
        {
          symbol: 'US10Y',
          yield: 3.5,
          price: 98.5,
          duration: 8.5,
          coupon: 3.0,
          maturity: '2033-05-15',
          rating: 'AAA'
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });
      const result = await marketDataApi.getBondData(['US10Y']);
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/bonds'),
        expect.any(Object)
      );
    });
  });

  describe('getEconomicData', () => {
    it('应该从缓存返回数据', async () => {
      const mockData = {
        gdp: 2.5,
        inflation: 3.2,
        unemployment: 4.0,
        interestRate: 5.25,
        consumerConfidence: 98.5,
        manufacturingPMI: 52.3,
        retailSales: 1.8
      };

      await cacheService.set('economic:data', mockData);
      const result = await marketDataApi.getEconomicData();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('应该从API获取数据并缓存', async () => {
      const mockData = {
        gdp: 2.5,
        inflation: 3.2,
        unemployment: 4.0,
        interestRate: 5.25,
        consumerConfidence: 98.5,
        manufacturingPMI: 52.3,
        retailSales: 1.8
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });
      const result = await marketDataApi.getEconomicData();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/indicators'),
        expect.any(Object)
      );
    });
  });

  describe('getCryptoData', () => {
    it('应该从缓存返回数据', async () => {
      const mockData = [
        {
          symbol: 'BTC',
          price: 50000,
          change24h: 2.5,
          volume24h: 30000000000,
          marketCap: 1000000000000
        }
      ];

      await cacheService.set('crypto:BTC', mockData);
      const result = await marketDataApi.getCryptoData(['BTC']);
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('应该从API获取数据并缓存', async () => {
      const mockData = [
        {
          symbol: 'BTC',
          price: 50000,
          change24h: 2.5,
          volume24h: 30000000000,
          marketCap: 1000000000000
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });
      const result = await marketDataApi.getCryptoData(['BTC']);
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/prices'),
        expect.any(Object)
      );
    });
  });

  describe('getCommodityData', () => {
    it('应该从缓存返回数据', async () => {
      const mockData = [
        {
          symbol: 'GOLD',
          price: 1800,
          change: 15,
          unit: 'USD/oz'
        }
      ];

      await cacheService.set('commodity:GOLD', mockData);
      const result = await marketDataApi.getCommodityData(['GOLD']);
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('应该从API获取数据并缓存', async () => {
      const mockData = [
        {
          symbol: 'GOLD',
          price: 1800,
          change: 15,
          unit: 'USD/oz'
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });
      const result = await marketDataApi.getCommodityData(['GOLD']);
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/prices'),
        expect.any(Object)
      );
    });
  });

  describe('getMarketNews', () => {
    it('应该从缓存返回数据', async () => {
      const mockData = [
        {
          id: '1',
          title: 'Market Update',
          content: 'Market shows strong performance',
          timestamp: '2024-03-20T10:00:00Z'
        }
      ];

      await cacheService.set('market:news', mockData);
      const result = await marketDataApi.getMarketNews();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('应该从API获取数据并缓存', async () => {
      const mockData = [
        {
          id: '1',
          title: 'Market Update',
          content: 'Market shows strong performance',
          timestamp: '2024-03-20T10:00:00Z'
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });
      const result = await marketDataApi.getMarketNews();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/market'),
        expect.any(Object)
      );
    });
  });

  describe('getMarketSentiment', () => {
    it('应该从缓存返回数据', async () => {
      const mockData = {
        fearGreedIndex: 65,
        marketMood: 'bullish',
        volatilityIndex: 15
      };

      await cacheService.set('market:sentiment', mockData);
      const result = await marketDataApi.getMarketSentiment();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('应该从API获取数据并缓存', async () => {
      const mockData = {
        fearGreedIndex: 65,
        marketMood: 'bullish',
        volatilityIndex: 15
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });
      const result = await marketDataApi.getMarketSentiment();
      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/market'),
        expect.any(Object)
      );
    });

    it('应该在API错误时返回默认值', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
      const result = await marketDataApi.getMarketSentiment();
      expect(result).toEqual({
        fearGreedIndex: 50,
        marketMood: 'neutral',
        volatilityIndex: 0
      });
    });
  });

  describe('MarketDataApi - 新增数据源测试', () => {
    let marketDataApi: MarketDataApi;
    let cacheService: CacheService;
    let monitoringService: MonitoringService;

    beforeEach(() => {
      cacheService = CacheService.getInstance();
      monitoringService = MonitoringService.getInstance();
      marketDataApi = new MarketDataApi();
    });

    describe('getForexData', () => {
      it('应该返回缓存的外汇数据', async () => {
        const mockData = [
          {
            symbol: 'EUR/USD',
            rate: 1.1234,
            change: 0.0012,
            changePercent: 0.11,
            bid: 1.1233,
            ask: 1.1235,
            high: 1.1250,
            low: 1.1220,
            volume: 1000000
          }
        ];

        await cacheService.set('forex:EUR/USD', mockData, 60);
        const result = await marketDataApi.getForexData(['EUR/USD']);
        expect(result).toEqual(mockData);
      });

      it('应该从API获取外汇数据并缓存', async () => {
        const mockData = [
          {
            symbol: 'EUR/USD',
            rate: 1.1234,
            change: 0.0012,
            changePercent: 0.11,
            bid: 1.1233,
            ask: 1.1235,
            high: 1.1250,
            low: 1.1220,
            volume: 1000000
          }
        ];

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });
        const result = await marketDataApi.getForexData(['EUR/USD']);
        expect(result).toEqual(mockData);
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/rates'),
          expect.any(Object)
        );
      });

      it('应该在API错误时返回空数组', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
        const result = await marketDataApi.getForexData(['EUR/USD']);
        expect(result).toEqual([]);
      });
    });

    describe('getFuturesData', () => {
      it('应该返回缓存的期货数据', async () => {
        const mockData = [
          {
            symbol: 'ES',
            price: 4500.25,
            change: 12.5,
            changePercent: 0.28,
            openInterest: 2500000,
            volume: 1500000,
            settlement: 4487.75,
            nextDelivery: '2024-03-15'
          }
        ];

        await cacheService.set('futures:ES', mockData, 60);
        const result = await marketDataApi.getFuturesData(['ES']);
        expect(result).toEqual(mockData);
      });

      it('应该从API获取期货数据并缓存', async () => {
        const mockData = [
          {
            symbol: 'ES',
            price: 4500.25,
            change: 12.5,
            changePercent: 0.28,
            openInterest: 2500000,
            volume: 1500000,
            settlement: 4487.75,
            nextDelivery: '2024-03-15'
          }
        ];

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });
        const result = await marketDataApi.getFuturesData(['ES']);
        expect(result).toEqual(mockData);
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/contracts'),
          expect.any(Object)
        );
      });

      it('应该在API错误时返回空数组', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
        const result = await marketDataApi.getFuturesData(['ES']);
        expect(result).toEqual([]);
      });
    });

    describe('getOptionsData', () => {
      it('应该返回缓存的期权数据', async () => {
        const mockData = [
          {
            symbol: 'AAPL',
            strike: 150,
            expiration: '2024-03-15',
            type: 'call',
            price: 5.25,
            change: 0.25,
            changePercent: 5.0,
            volume: 10000,
            openInterest: 5000,
            impliedVolatility: 0.25,
            delta: 0.65
          }
        ];

}); 