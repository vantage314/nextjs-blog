import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { WebSocket, MessageEvent } from 'ws';

export class TestUtils {
  private static mongoServer: MongoMemoryServer;
  private static server: any;

  static async setupTestEnvironment() {
    // 创建内存MongoDB服务器
    this.mongoServer = await MongoMemoryServer.create();
    const mongoUri = this.mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // 创建HTTP服务器
    this.server = createServer();
    this.server.listen(0);

    return {
      mongoUri,
      server: this.server
    };
  }

  static async cleanupTestEnvironment() {
    if (this.server) {
      this.server.close();
    }
    await mongoose.disconnect();
    if (this.mongoServer) {
      await this.mongoServer.stop();
    }
  }

  static createWebSocketClient(port: number): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const client = new WebSocket(`ws://localhost:${port}`);
      
      client.on('open', () => {
        resolve(client);
      });

      client.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  static async waitForWebSocketMessage(client: WebSocket): Promise<any> {
    return new Promise((resolve) => {
      client.once('message', (data: MessageEvent) => {
        resolve(JSON.parse(data.toString()));
      });
    });
  }

  static async waitForCondition(condition: () => boolean, timeout = 5000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (condition()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return false;
  }

  static generateTestData(type: string, count: number) {
    const data = [];
    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'stocks':
          data.push({
            symbol: `STOCK${i}`,
            price: Math.random() * 1000,
            volume: Math.floor(Math.random() * 1000000),
            timestamp: Date.now()
          });
          break;
        case 'forex':
          data.push({
            pair: `CURRENCY${i}`,
            rate: Math.random() * 2,
            timestamp: Date.now()
          });
          break;
        case 'futures':
          data.push({
            contract: `FUTURE${i}`,
            price: Math.random() * 2000,
            volume: Math.floor(Math.random() * 500000),
            timestamp: Date.now()
          });
          break;
        default:
          data.push({
            id: `${type}${i}`,
            value: Math.random() * 100,
            timestamp: Date.now()
          });
      }
    }
    return data;
  }

  static mockMarketDataApi() {
    return {
      getStockData: jest.fn().mockResolvedValue(this.generateTestData('stocks', 10)),
      getForexData: jest.fn().mockResolvedValue(this.generateTestData('forex', 10)),
      getFuturesData: jest.fn().mockResolvedValue(this.generateTestData('futures', 10)),
      getOptionsData: jest.fn().mockResolvedValue(this.generateTestData('options', 10)),
      getIndustryIndices: jest.fn().mockResolvedValue(this.generateTestData('industry', 5))
    };
  }

  static mockCacheService() {
    return {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      publish: jest.fn(),
      getStats: jest.fn().mockResolvedValue({
        hitRate: 0.8,
        missRate: 0.2,
        keys: 100
      })
    };
  }

  static mockMonitoringService() {
    return {
      recordApiLatency: jest.fn(),
      recordCacheHit: jest.fn(),
      recordCacheMiss: jest.fn(),
      recordWsConnection: jest.fn(),
      recordWsDisconnection: jest.fn(),
      recordWsDrop: jest.fn(),
      recordWsError: jest.fn(),
      recordPrefetchSuccess: jest.fn(),
      recordPrefetchFailure: jest.fn(),
      getMetrics: jest.fn().mockReturnValue({
        timestamp: Date.now(),
        apiLatency: {},
        cacheHitRate: 0.8,
        memoryUsage: {
          heapUsed: 1000000,
          heapTotal: 2000000,
          external: 500000,
          rss: 3000000
        },
        wsConnections: {
          total: 10,
          active: 8,
          dropped: 2
        },
        dataUpdates: {
          total: 100,
          success: 90,
          failed: 10
        },
        systemMetrics: {
          cpu: {
            usage: 0.5,
            loadAvg: [1.5, 1.2, 1.0]
          },
          memory: {
            total: 8000000,
            free: 4000000,
            used: 4000000,
            usagePercent: 0.5
          },
          disk: {
            total: 100000000,
            free: 50000000,
            used: 50000000,
            usagePercent: 0.5
          },
          network: {
            bytesIn: 1000000,
            bytesOut: 500000,
            connections: 50
          }
        },
        businessMetrics: {
          activeUsers: 100,
          requestsPerMinute: 1000,
          errorRate: 0.01,
          averageResponseTime: 100,
          dataVolume: {
            total: 1000000,
            cached: 800000,
            realtime: 200000
          },
          prefetchMetrics: {
            totalTasks: 100,
            successRate: 0.95,
            averageLatency: 200
          }
        }
      })
    };
  }
} 