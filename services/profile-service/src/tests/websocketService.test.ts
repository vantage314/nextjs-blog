import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { WebSocketService } from '../services/websocketService';
import { MonitoringService } from '../services/monitoringService';
import { MarketDataApi } from '../services/marketDataApi';
import { createServer } from 'http';
import WebSocket from 'ws';

jest.mock('../services/monitoringService');
jest.mock('../services/marketDataApi');

describe('WebSocketService', () => {
  let mongoServer: MongoMemoryServer;
  let server: any;
  let wsService: WebSocketService;
  let monitoringService: MonitoringService;
  let marketDataApi: MarketDataApi;
  let client: WebSocket;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    server = createServer();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    monitoringService = MonitoringService.getInstance();
    marketDataApi = MarketDataApi.getInstance();
    wsService = WebSocketService.getInstance(server);
  });

  afterEach(() => {
    if (client) {
      client.close();
    }
    wsService.stop();
  });

  describe('连接管理', () => {
    it('应该正确处理新的WebSocket连接', (done) => {
      client = new WebSocket(`ws://localhost:${server.address().port}`);

      client.on('open', () => {
        expect(monitoringService.recordWsConnection).toHaveBeenCalled();
        done();
      });
    });

    it('应该正确处理连接断开', (done) => {
      client = new WebSocket(`ws://localhost:${server.address().port}`);

      client.on('open', () => {
        client.close();
      });

      client.on('close', () => {
        expect(monitoringService.recordWsDisconnection).toHaveBeenCalled();
        done();
      });
    });

    it('应该生成唯一的客户端ID', (done) => {
      client = new WebSocket(`ws://localhost:${server.address().port}`);

      client.on('message', (data) => {
        const message = JSON.parse(data.toString());
        expect(message.type).toBe('welcome');
        expect(message.data.clientId).toMatch(/^client_\d+_[a-z0-9]+$/);
        done();
      });
    });
  });

  describe('消息处理', () => {
    it('应该正确处理订阅消息', (done) => {
      client = new WebSocket(`ws://localhost:${server.address().port}`);

      client.on('open', () => {
        client.send(JSON.stringify({
          type: 'subscribe',
          channels: ['stocks', 'crypto']
        }));

        setTimeout(() => {
          const stats = wsService.getSubscriptionStats();
          expect(stats['stocks']).toBe(1);
          expect(stats['crypto']).toBe(1);
          done();
        }, 100);
      });
    });

    it('应该正确处理取消订阅消息', (done) => {
      client = new WebSocket(`ws://localhost:${server.address().port}`);

      client.on('open', () => {
        client.send(JSON.stringify({
          type: 'subscribe',
          channels: ['stocks']
        }));

        setTimeout(() => {
          client.send(JSON.stringify({
            type: 'unsubscribe',
            channels: ['stocks']
          }));

          setTimeout(() => {
            const stats = wsService.getSubscriptionStats();
            expect(stats['stocks']).toBeUndefined();
            done();
          }, 100);
        }, 100);
      });
    });

    it('应该正确处理心跳消息', (done) => {
      client = new WebSocket(`ws://localhost:${server.address().port}`);

      client.on('open', () => {
        client.send(JSON.stringify({
          type: 'ping'
        }));

        client.on('message', (data) => {
          const message = JSON.parse(data.toString());
          if (message.type === 'pong') {
            done();
          }
        });
      });
    });
  });

  describe('重连机制', () => {
    it('应该在连接断开时尝试重连', (done) => {
      client = new WebSocket(`ws://localhost:${server.address().port}`);

      client.on('open', () => {
        // 模拟连接断开
        client.terminate();
      });

      // 等待重连尝试
      setTimeout(() => {
        expect(monitoringService.recordWsDisconnection).toHaveBeenCalled();
        done();
      }, 2000);
    });

    it('应该在达到最大重试次数后停止重连', (done) => {
      client = new WebSocket(`ws://localhost:${server.address().port}`);

      client.on('open', () => {
        // 模拟多次连接失败
        for (let i = 0; i < 6; i++) {
          client.terminate();
        }
      });

      setTimeout(() => {
        expect(monitoringService.recordWsDrop).toHaveBeenCalled();
        done();
      }, 10000);
    });
  });

  describe('心跳检测', () => {
    it('应该在心跳超时时断开连接', (done) => {
      client = new WebSocket(`ws://localhost:${server.address().port}`);

      client.on('open', () => {
        // 模拟心跳超时
        jest.advanceTimersByTime(40000);
      });

      client.on('close', () => {
        expect(monitoringService.recordWsDisconnection).toHaveBeenCalled();
        done();
      });
    });

    it('应该保持活跃连接', (done) => {
      client = new WebSocket(`ws://localhost:${server.address().port}`);

      client.on('open', () => {
        // 定期发送心跳
        const interval = setInterval(() => {
          client.send(JSON.stringify({ type: 'ping' }));
        }, 5000);

        setTimeout(() => {
          clearInterval(interval);
          const stats = wsService.getConnectionStats();
          expect(stats.active).toBe(1);
          done();
        }, 10000);
      });
    });
  });

  describe('市场数据更新', () => {
    it('应该向订阅的客户端广播市场数据', (done) => {
      client = new WebSocket(`ws://localhost:${server.address().port}`);

      client.on('open', () => {
        client.send(JSON.stringify({
          type: 'subscribe',
          channels: ['stocks']
        }));

        // 等待市场数据更新
        setTimeout(() => {
          client.on('message', (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === 'stocks') {
              expect(message.data).toBeDefined();
              expect(message.timestamp).toBeDefined();
              done();
            }
          });
        }, 2000);
      });
    });

    it('不应该向未订阅的客户端发送数据', (done) => {
      client = new WebSocket(`ws://localhost:${server.address().port}`);

      client.on('open', () => {
        // 不订阅任何频道
        setTimeout(() => {
          client.on('message', (data) => {
            const message = JSON.parse(data.toString());
            expect(message.type).not.toBe('stocks');
            expect(message.type).not.toBe('crypto');
            done();
          });
        }, 2000);
      });
    });
  });
}); 