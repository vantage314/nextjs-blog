import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { WebSocketService } from '../services/websocketService';
import { MonitoringService } from '../services/monitoringService';
import { CacheService, CacheConfig } from '../services/cacheService';
import { MarketDataApi } from '../services/marketDataApi';
import { PrefetchService } from '../services/prefetchService';

let mongoServer: MongoMemoryServer;
let server: any;

// 全局测试设置
beforeAll(async () => {
  // 创建内存MongoDB服务器
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // 创建HTTP服务器
  server = createServer();
  server.listen(0); // 使用随机端口

  // 初始化服务实例
  const cacheConfig: CacheConfig = {
    host: 'localhost',
    port: 6379,
    keyPrefix: 'test:'
  };
  global.cacheService = CacheService.getInstance(cacheConfig);
  global.monitoringService = MonitoringService.getInstance();
  global.marketDataApi = MarketDataApi.getInstance();
  global.wsService = WebSocketService.getInstance(server);
  global.prefetchService = PrefetchService.getInstance();
});

// 清理测试环境
afterAll(async () => {
  // 停止所有服务
  if (global.wsService) {
    global.wsService.stop();
  }
  if (global.prefetchService) {
    global.prefetchService.stop();
  }
  if (global.monitoringService) {
    global.monitoringService.stop();
  }
  if (global.cacheService) {
    await global.cacheService.close();
  }

  // 关闭服务器和数据库连接
  if (server) {
    server.close();
  }
  await mongoose.disconnect();
  await mongoServer.stop();
});

// 每个测试前的设置
beforeEach(() => {
  jest.clearAllMocks();
});

// 每个测试后的清理
afterEach(async () => {
  // 清理数据库
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// 全局类型声明
declare global {
  var cacheService: CacheService;
  var monitoringService: MonitoringService;
  var marketDataApi: MarketDataApi;
  var wsService: WebSocketService;
  var prefetchService: PrefetchService;
} 