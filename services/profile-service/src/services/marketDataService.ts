import axios from 'axios';
import { logger } from '../utils/logger';
import { getRedisClient } from '../config/redis';

interface MarketData {
  stocks: {
    valuation: number;
    trend: 'up' | 'down' | 'stable';
    pe: number;
    dividend: number;
  };
  bonds: {
    yield: number;
    trend: 'up' | 'down' | 'stable';
    duration: number;
  };
  realEstate: {
    priceToRent: number;
    trend: 'up' | 'down' | 'stable';
    capRate: number;
  };
  economicCycle: 'expansion' | 'peak' | 'contraction' | 'trough';
  interestRate: number;
  inflation: number;
}

export class MarketDataService {
  private static readonly CACHE_TTL = 3600; // 1小时缓存
  private static readonly API_BASE_URL = process.env.MARKET_DATA_API_URL || 'https://api.marketdata.example.com';

  static async getMarketData(): Promise<MarketData> {
    try {
      const redisClient = getRedisClient();
      const cacheKey = 'market:data';

      // 尝试从缓存获取数据
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // 从API获取数据
      const [stocksData, bondsData, realEstateData, economicData] = await Promise.all([
        this.fetchStocksData(),
        this.fetchBondsData(),
        this.fetchRealEstateData(),
        this.fetchEconomicData()
      ]);

      const marketData: MarketData = {
        stocks: stocksData,
        bonds: bondsData,
        realEstate: realEstateData,
        economicCycle: economicData.cycle,
        interestRate: economicData.interestRate,
        inflation: economicData.inflation
      };

      // 缓存数据
      await redisClient.set(cacheKey, JSON.stringify(marketData), { EX: this.CACHE_TTL });

      return marketData;
    } catch (error) {
      logger.error('获取市场数据失败:', error);
      throw error;
    }
  }

  private static async fetchStocksData() {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/stocks`);
      return {
        valuation: response.data.valuation,
        trend: response.data.trend,
        pe: response.data.pe,
        dividend: response.data.dividend
      };
    } catch (error) {
      logger.error('获取股票数据失败:', error);
      // 返回默认值
      return {
        valuation: 1.0,
        trend: 'stable',
        pe: 15,
        dividend: 2.5
      };
    }
  }

  private static async fetchBondsData() {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/bonds`);
      return {
        yield: response.data.yield,
        trend: response.data.trend,
        duration: response.data.duration
      };
    } catch (error) {
      logger.error('获取债券数据失败:', error);
      // 返回默认值
      return {
        yield: 3.5,
        trend: 'stable',
        duration: 5
      };
    }
  }

  private static async fetchRealEstateData() {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/real-estate`);
      return {
        priceToRent: response.data.priceToRent,
        trend: response.data.trend,
        capRate: response.data.capRate
      };
    } catch (error) {
      logger.error('获取房地产数据失败:', error);
      // 返回默认值
      return {
        priceToRent: 20,
        trend: 'stable',
        capRate: 4.5
      };
    }
  }

  private static async fetchEconomicData() {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/economic`);
      return {
        cycle: response.data.cycle,
        interestRate: response.data.interestRate,
        inflation: response.data.inflation
      };
    } catch (error) {
      logger.error('获取经济数据失败:', error);
      // 返回默认值
      return {
        cycle: 'expansion',
        interestRate: 2.5,
        inflation: 2.0
      };
    }
  }
} 