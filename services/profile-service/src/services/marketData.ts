import axios from 'axios';
import { logger } from '../utils/logger';
import { getRedisClient } from '../config/redis';

interface MarketData {
  stocks: {
    index: string;
    value: number;
    change: number;
    changePercent: number;
  }[];
  bonds: {
    type: string;
    yield: number;
    change: number;
  }[];
  commodities: {
    name: string;
    price: number;
    change: number;
  }[];
  exchangeRates: {
    pair: string;
    rate: number;
    change: number;
  }[];
}

export class MarketDataService {
  private static readonly CACHE_TTL = 300; // 5分钟缓存

  static async getMarketData(): Promise<MarketData> {
    const redisClient = getRedisClient();
    
    // 尝试从缓存获取
    const cachedData = await redisClient.get('market:data');
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    try {
      // 获取股票市场数据
      const stocksData = await this.fetchStocksData();
      
      // 获取债券市场数据
      const bondsData = await this.fetchBondsData();
      
      // 获取大宗商品数据
      const commoditiesData = await this.fetchCommoditiesData();
      
      // 获取汇率数据
      const exchangeRatesData = await this.fetchExchangeRatesData();

      const marketData: MarketData = {
        stocks: stocksData,
        bonds: bondsData,
        commodities: commoditiesData,
        exchangeRates: exchangeRatesData
      };

      // 缓存数据
      await redisClient.set(
        'market:data',
        JSON.stringify(marketData),
        { EX: this.CACHE_TTL }
      );

      return marketData;
    } catch (error) {
      logger.error('获取市场数据失败:', error);
      throw error;
    }
  }

  private static async fetchStocksData() {
    // 这里应该调用实际的股票市场 API
    // 示例数据
    return [
      {
        index: '上证指数',
        value: 3000.00,
        change: 15.50,
        changePercent: 0.52
      },
      {
        index: '深证成指',
        value: 12000.00,
        change: 45.30,
        changePercent: 0.38
      }
    ];
  }

  private static async fetchBondsData() {
    // 这里应该调用实际的债券市场 API
    // 示例数据
    return [
      {
        type: '10年期国债',
        yield: 2.85,
        change: -0.05
      },
      {
        type: '企业债',
        yield: 3.25,
        change: 0.02
      }
    ];
  }

  private static async fetchCommoditiesData() {
    // 这里应该调用实际的大宗商品 API
    // 示例数据
    return [
      {
        name: '黄金',
        price: 1800.00,
        change: 5.50
      },
      {
        name: '原油',
        price: 75.00,
        change: -1.20
      }
    ];
  }

  private static async fetchExchangeRatesData() {
    // 这里应该调用实际的汇率 API
    // 示例数据
    return [
      {
        pair: 'USD/CNY',
        rate: 6.45,
        change: 0.02
      },
      {
        pair: 'EUR/CNY',
        rate: 7.85,
        change: -0.03
      }
    ];
  }
} 