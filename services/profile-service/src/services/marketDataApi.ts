import axios from 'axios';
import { logger } from '../utils/logger';
import { CacheService } from './cacheService';
import { MonitoringService } from './monitoringService';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
}

interface BondData {
  symbol: string;
  yield: number;
  price: number;
  duration: number;
  coupon: number;
  maturity: string;
  rating: string;
}

interface EconomicData {
  gdp: number;
  inflation: number;
  unemployment: number;
  interestRate: number;
  consumerConfidence: number;
  manufacturingPMI: number;
  retailSales: number;
}

interface CryptoData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

interface CommodityData {
  symbol: string;
  price: number;
  change: number;
  unit: string;
}

interface ForexData {
  symbol: string;
  rate: number;
  change: number;
  changePercent: number;
  bid: number;
  ask: number;
  high: number;
  low: number;
  volume: number;
}

interface FuturesData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  openInterest: number;
  volume: number;
  settlement: number;
  nextDelivery: string;
}

interface OptionsData {
  symbol: string;
  strike: number;
  expiration: string;
  type: 'call' | 'put';
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta: number;
}

interface IndustryIndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  components: string[];
}

export class MarketDataApi {
  private static instance: MarketDataApi;
  private cacheService: CacheService;
  private monitoringService: MonitoringService;

  private constructor() {
    this.cacheService = CacheService.getInstance();
    this.monitoringService = MonitoringService.getInstance();
  }

  public static getInstance(): MarketDataApi {
    if (!MarketDataApi.instance) {
      MarketDataApi.instance = new MarketDataApi();
    }
    return MarketDataApi.instance;
  }

  public async getStockData(symbols: string[]): Promise<StockData[]> {
    const startTime = performance.now();
    try {
      const cacheKey = `stocks:${symbols.join(',')}`;
      const cachedData = await this.cacheService.get<StockData[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${process.env.STOCK_API_URL}/stocks`, {
        params: { symbols: symbols.join(',') }
      });

      const data = response.data;
      await this.cacheService.set(cacheKey, data, 300); // 5分钟缓存
      await this.monitoringService.recordApiLatency('api:stocks', startTime);
      return data;
    } catch (error) {
      logger.error('获取股票数据失败:', error);
      await this.monitoringService.recordApiLatency('api:stocks:error', startTime);
      return [];
    }
  }

  public async getBondData(symbols: string[]): Promise<BondData[]> {
    const startTime = performance.now();
    try {
      const cacheKey = `bonds:${symbols.join(',')}`;
      const cachedData = await this.cacheService.get<BondData[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${process.env.BOND_API_URL}/bonds`, {
        params: { symbols: symbols.join(',') }
      });

      const data = response.data;
      await this.cacheService.set(cacheKey, data, 300);
      await this.monitoringService.recordApiLatency('api:bonds', startTime);
      return data;
    } catch (error) {
      logger.error('获取债券数据失败:', error);
      await this.monitoringService.recordApiLatency('api:bonds:error', startTime);
      return [];
    }
  }

  public async getEconomicData(): Promise<EconomicData> {
    const startTime = performance.now();
    try {
      const cacheKey = 'economic:data';
      const cachedData = await this.cacheService.get<EconomicData>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${process.env.ECONOMIC_API_URL}/indicators`);
      const data = response.data;
      await this.cacheService.set(cacheKey, data, 3600); // 1小时缓存
      await this.monitoringService.recordApiLatency('api:economic', startTime);
      return data;
    } catch (error) {
      logger.error('获取经济数据失败:', error);
      await this.monitoringService.recordApiLatency('api:economic:error', startTime);
      return {
        gdp: 0,
        inflation: 0,
        unemployment: 0,
        interestRate: 0,
        consumerConfidence: 0,
        manufacturingPMI: 0,
        retailSales: 0
      };
    }
  }

  public async getCryptoData(symbols: string[]): Promise<CryptoData[]> {
    const startTime = performance.now();
    try {
      const cacheKey = `crypto:${symbols.join(',')}`;
      const cachedData = await this.cacheService.get<CryptoData[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${process.env.CRYPTO_API_URL}/prices`, {
        params: { symbols: symbols.join(',') }
      });

      const data = response.data;
      await this.cacheService.set(cacheKey, data, 60); // 1分钟缓存
      await this.monitoringService.recordApiLatency('api:crypto', startTime);
      return data;
    } catch (error) {
      logger.error('获取加密货币数据失败:', error);
      await this.monitoringService.recordApiLatency('api:crypto:error', startTime);
      return [];
    }
  }

  public async getCommodityData(symbols: string[]): Promise<CommodityData[]> {
    const startTime = performance.now();
    try {
      const cacheKey = `commodity:${symbols.join(',')}`;
      const cachedData = await this.cacheService.get<CommodityData[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${process.env.COMMODITY_API_URL}/prices`, {
        params: { symbols: symbols.join(',') }
      });

      const data = response.data;
      await this.cacheService.set(cacheKey, data, 300);
      await this.monitoringService.recordApiLatency('api:commodity', startTime);
      return data;
    } catch (error) {
      logger.error('获取大宗商品数据失败:', error);
      await this.monitoringService.recordApiLatency('api:commodity:error', startTime);
      return [];
    }
  }

  public async getMarketNews(): Promise<any[]> {
    const startTime = performance.now();
    try {
      const cacheKey = 'market:news';
      const cachedData = await this.cacheService.get<any[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${process.env.NEWS_API_URL}/market`);
      const data = response.data;
      await this.cacheService.set(cacheKey, data, 900); // 15分钟缓存
      await this.monitoringService.recordApiLatency('api:news', startTime);
      return data;
    } catch (error) {
      logger.error('获取市场新闻失败:', error);
      await this.monitoringService.recordApiLatency('api:news:error', startTime);
      return [];
    }
  }

  public async getMarketSentiment(): Promise<any> {
    const startTime = performance.now();
    try {
      const cacheKey = 'market:sentiment';
      const cachedData = await this.cacheService.get<any>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${process.env.SENTIMENT_API_URL}/market`);
      const data = response.data;
      await this.cacheService.set(cacheKey, data, 1800); // 30分钟缓存
      await this.monitoringService.recordApiLatency('api:sentiment', startTime);
      return data;
    } catch (error) {
      logger.error('获取市场情绪数据失败:', error);
      await this.monitoringService.recordApiLatency('api:sentiment:error', startTime);
      return {
        fearGreedIndex: 50,
        marketMood: 'neutral',
        volatilityIndex: 0
      };
    }
  }

  public async getForexData(symbols: string[]): Promise<ForexData[]> {
    const startTime = performance.now();
    try {
      const cacheKey = `forex:${symbols.join(',')}`;
      const cachedData = await this.cacheService.get<ForexData[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${process.env.FOREX_API_URL}/rates`, {
        params: { symbols: symbols.join(',') }
      });

      const data = response.data;
      await this.cacheService.set(cacheKey, data, 60); // 1分钟缓存
      await this.monitoringService.recordApiLatency('api:forex', startTime);
      return data;
    } catch (error) {
      logger.error('获取外汇数据失败:', error);
      await this.monitoringService.recordApiLatency('api:forex:error', startTime);
      return [];
    }
  }

  public async getFuturesData(symbols: string[]): Promise<FuturesData[]> {
    const startTime = performance.now();
    try {
      const cacheKey = `futures:${symbols.join(',')}`;
      const cachedData = await this.cacheService.get<FuturesData[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${process.env.FUTURES_API_URL}/contracts`, {
        params: { symbols: symbols.join(',') }
      });

      const data = response.data;
      await this.cacheService.set(cacheKey, data, 60); // 1分钟缓存
      await this.monitoringService.recordApiLatency('api:futures', startTime);
      return data;
    } catch (error) {
      logger.error('获取期货数据失败:', error);
      await this.monitoringService.recordApiLatency('api:futures:error', startTime);
      return [];
    }
  }

  public async getOptionsData(symbol: string, expiration?: string): Promise<OptionsData[]> {
    const startTime = performance.now();
    try {
      const cacheKey = `options:${symbol}:${expiration || 'all'}`;
      const cachedData = await this.cacheService.get<OptionsData[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${process.env.OPTIONS_API_URL}/chain`, {
        params: { symbol, expiration }
      });

      const data = response.data;
      await this.cacheService.set(cacheKey, data, 60); // 1分钟缓存
      await this.monitoringService.recordApiLatency('api:options', startTime);
      return data;
    } catch (error) {
      logger.error('获取期权数据失败:', error);
      await this.monitoringService.recordApiLatency('api:options:error', startTime);
      return [];
    }
  }

  public async getIndustryIndices(): Promise<IndustryIndexData[]> {
    const startTime = performance.now();
    try {
      const cacheKey = 'industry:indices';
      const cachedData = await this.cacheService.get<IndustryIndexData[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${process.env.INDUSTRY_API_URL}/indices`);
      const data = response.data;
      await this.cacheService.set(cacheKey, data, 300); // 5分钟缓存
      await this.monitoringService.recordApiLatency('api:industry', startTime);
      return data;
    } catch (error) {
      logger.error('获取行业指数数据失败:', error);
      await this.monitoringService.recordApiLatency('api:industry:error', startTime);
      return [];
    }
  }

  public async getMarketOverview(): Promise<any> {
    const startTime = performance.now();
    try {
      const cacheKey = 'market:overview';
      const cachedData = await this.cacheService.get<any>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const [
        stocks,
        bonds,
        forex,
        crypto,
        commodities,
        sentiment
      ] = await Promise.all([
        this.getStockData(['SPY', 'QQQ', 'DIA']),
        this.getBondData(['US10Y', 'US2Y', 'US30Y']),
        this.getForexData(['EUR/USD', 'GBP/USD', 'USD/JPY']),
        this.getCryptoData(['BTC', 'ETH']),
        this.getCommodityData(['GOLD', 'SILVER', 'OIL']),
        this.getMarketSentiment()
      ]);

      const overview = {
        stocks,
        bonds,
        forex,
        crypto,
        commodities,
        sentiment,
        timestamp: Date.now()
      };

      await this.cacheService.set(cacheKey, overview, 60); // 1分钟缓存
      await this.monitoringService.recordApiLatency('api:overview', startTime);
      return overview;
    } catch (error) {
      logger.error('获取市场概览失败:', error);
      await this.monitoringService.recordApiLatency('api:overview:error', startTime);
      return {
        stocks: [],
        bonds: [],
        forex: [],
        crypto: [],
        commodities: [],
        sentiment: {
          fearGreedIndex: 50,
          marketMood: 'neutral',
          volatilityIndex: 0
        },
        timestamp: Date.now()
      };
    }
  }
} 