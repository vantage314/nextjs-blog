import { logger } from '../utils/logger';
import { getRedisClient } from '../config/redis';
import { WebSocketService } from './websocketService';
import { MarketDataApi } from './marketDataApi';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

interface BondData {
  symbol: string;
  yield: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

interface EconomicData {
  indicator: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export class RealtimeMarketService {
  private static instance: RealtimeMarketService;
  private redisClient: any;
  private wsService: WebSocketService;
  private marketDataApi: MarketDataApi;
  private updateInterval: NodeJS.Timeout | null = null;

  private constructor(wsService: WebSocketService) {
    this.redisClient = getRedisClient();
    this.wsService = wsService;
    this.marketDataApi = MarketDataApi.getInstance();
  }

  public static getInstance(wsService: WebSocketService): RealtimeMarketService {
    if (!RealtimeMarketService.instance) {
      RealtimeMarketService.instance = new RealtimeMarketService(wsService);
    }
    return RealtimeMarketService.instance;
  }

  public async start() {
    // 每5秒更新一次数据
    this.updateInterval = setInterval(async () => {
      try {
        await this.updateMarketData();
      } catch (error) {
        logger.error('更新市场数据失败:', error);
      }
    }, 5000);
  }

  public stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private async updateMarketData() {
    try {
      // 获取订阅的股票
      const stockSymbols = await this.getSubscribedSymbols('stock');
      const stockData = await this.fetchStockData(stockSymbols);
      await this.broadcastStockData(stockData);

      // 获取订阅的债券
      const bondSymbols = await this.getSubscribedSymbols('bond');
      const bondData = await this.fetchBondData(bondSymbols);
      await this.broadcastBondData(bondData);

      // 获取订阅的经济指标
      const economicIndicators = await this.getSubscribedSymbols('economic');
      const economicData = await this.fetchEconomicData(economicIndicators);
      await this.broadcastEconomicData(economicData);
    } catch (error) {
      logger.error('更新市场数据失败:', error);
    }
  }

  private async getSubscribedSymbols(type: string): Promise<string[]> {
    const subscriptionKey = `subscription:${type}`;
    return await this.redisClient.smembers(subscriptionKey);
  }

  private async fetchStockData(symbols: string[]): Promise<StockData[]> {
    try {
      if (symbols.length === 0) return [];

      const data = await this.marketDataApi.getStockData(symbols);
      return data.map((item: any) => ({
        symbol: item.symbol,
        price: item.price,
        change: item.change,
        changePercent: item.changePercent,
        volume: item.volume,
        timestamp: Date.now()
      }));
    } catch (error) {
      logger.error('获取股票数据失败:', error);
      return [];
    }
  }

  private async fetchBondData(symbols: string[]): Promise<BondData[]> {
    try {
      if (symbols.length === 0) return [];

      const data = await this.marketDataApi.getBondData(symbols);
      return data.map((item: any) => ({
        symbol: item.symbol,
        yield: item.yield,
        change: item.change,
        changePercent: item.changePercent,
        timestamp: Date.now()
      }));
    } catch (error) {
      logger.error('获取债券数据失败:', error);
      return [];
    }
  }

  private async fetchEconomicData(indicators: string[]): Promise<EconomicData[]> {
    try {
      if (indicators.length === 0) return [];

      const data = await this.marketDataApi.getEconomicData(indicators);
      return data.map((item: any) => ({
        indicator: item.indicator,
        value: item.value,
        change: item.change,
        changePercent: item.changePercent,
        timestamp: Date.now()
      }));
    } catch (error) {
      logger.error('获取经济指标数据失败:', error);
      return [];
    }
  }

  private async broadcastStockData(data: StockData[]) {
    for (const stock of data) {
      await this.wsService.broadcast({
        type: 'stock',
        symbol: stock.symbol,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        volume: stock.volume,
        timestamp: stock.timestamp
      });
    }
  }

  private async broadcastBondData(data: BondData[]) {
    for (const bond of data) {
      await this.wsService.broadcast({
        type: 'bond',
        symbol: bond.symbol,
        price: bond.yield,
        change: bond.change,
        changePercent: bond.changePercent,
        volume: 0,
        timestamp: bond.timestamp
      });
    }
  }

  private async broadcastEconomicData(data: EconomicData[]) {
    for (const indicator of data) {
      await this.wsService.broadcast({
        type: 'economic',
        symbol: indicator.indicator,
        price: indicator.value,
        change: indicator.change,
        changePercent: indicator.changePercent,
        volume: 0,
        timestamp: indicator.timestamp
      });
    }
  }
} 