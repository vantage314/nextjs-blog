import WebSocket from 'ws';
import { Server } from 'http';
import { logger } from '../utils/logger';
import { MonitoringService } from './monitoringService';
import { MarketDataApi } from './marketDataApi';
import { EventEmitter } from 'events';

interface WebSocketClient {
  id: string;
  ws: WebSocket;
  subscriptions: Set<string>;
  lastPing: number;
  reconnectAttempts: number;
  isAlive: boolean;
}

interface WebSocketMessage {
  type: string;
  channels?: string[];
  data?: any;
}

interface MarketUpdate {
  type: string;
  data: any;
  timestamp: number;
}

export class WebSocketService extends EventEmitter {
  private static instance: WebSocketService;
  private wss: WebSocket.Server;
  private clients: Map<string, WebSocketClient>;
  private monitoringService: MonitoringService;
  private marketDataApi: MarketDataApi;
  private heartbeatInterval: NodeJS.Timeout | undefined = undefined;
  private updateInterval: NodeJS.Timeout | undefined = undefined;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly INITIAL_RECONNECT_DELAY = 1000;
  private readonly MAX_RECONNECT_DELAY = 30000;
  private readonly HEARTBEAT_INTERVAL = 30000;
  private readonly PING_TIMEOUT = 10000;

  private constructor(server: Server) {
    super();
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    this.monitoringService = MonitoringService.getInstance();
    this.marketDataApi = MarketDataApi.getInstance();

    this.initialize();
  }

  public static getInstance(server?: Server): WebSocketService {
    if (!WebSocketService.instance && server) {
      WebSocketService.instance = new WebSocketService(server);
    }
    return WebSocketService.instance;
  }

  private initialize() {
    this.wss.on('connection', this.handleConnection.bind(this));
    this.startHeartbeat();
    this.startMarketUpdates();
  }

  private handleConnection(ws: WebSocket) {
    const clientId = this.generateClientId();
    const client: WebSocketClient = {
      id: clientId,
      ws,
      subscriptions: new Set(),
      lastPing: Date.now(),
      reconnectAttempts: 0,
      isAlive: true
    };

    this.clients.set(clientId, client);
    this.monitoringService.recordWsConnection();

    ws.on('message', (message: string) => {
      try {
        const data: WebSocketMessage = JSON.parse(message);
        this.handleMessage(client, data);
      } catch (error) {
        logger.error('WebSocket消息处理错误:', error);
      }
    });

    ws.on('close', () => {
      this.handleDisconnection(client);
    });

    ws.on('error', (error: Error) => {
      logger.error('WebSocket错误:', error);
      this.handleError(error);
    });

    ws.on('pong', () => {
      client.isAlive = true;
      client.lastPing = Date.now();
    });

    // 发送欢迎消息
    this.sendToClient(client, {
      type: 'welcome',
      data: { clientId },
      timestamp: Date.now()
    });
  }

  private handleMessage(client: WebSocketClient, message: WebSocketMessage) {
    switch (message.type) {
      case 'subscribe':
        if (message.channels) {
          message.channels.forEach(channel => {
            client.subscriptions.add(channel);
          });
        }
        break;

      case 'unsubscribe':
        if (message.channels) {
          message.channels.forEach(channel => {
            client.subscriptions.delete(channel);
          });
        }
        break;

      case 'ping':
        client.lastPing = Date.now();
        client.ws.send(JSON.stringify({ type: 'pong' }));
        break;
    }
  }

  private handleDisconnection(client: WebSocketClient) {
    this.clients.delete(client.id);
    this.monitoringService.recordWsDisconnection();

    // 尝试重连
    if (client.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      const delay = this.calculateReconnectDelay(client.reconnectAttempts);
      setTimeout(() => {
        this.attemptReconnect(client);
      }, delay);
    } else {
      this.monitoringService.recordWsDrop();
      logger.warn(`客户端 ${client.id} 重连失败次数过多，停止重连`);
    }
  }

  private handleError(error: Error) {
    logger.error('WebSocket错误:', error);
    this.monitoringService.recordWsError();
  }

  private calculateReconnectDelay(attempt: number): number {
    const delay = Math.min(
      this.INITIAL_RECONNECT_DELAY * Math.pow(2, attempt),
      this.MAX_RECONNECT_DELAY
    );
    return delay + Math.random() * 1000; // 添加随机抖动
  }

  private async attemptReconnect(client: WebSocketClient) {
    try {
      const ws = new WebSocket(`ws://localhost:${process.env.WS_PORT}`);
      
      ws.on('open', () => {
        client.reconnectAttempts = 0;
        client.ws = ws;
        client.isAlive = true;
        client.lastPing = Date.now();
        this.clients.set(client.id, client);
        
        // 重新订阅之前的频道
        client.subscriptions.forEach(channel => {
          ws.send(JSON.stringify({
            type: 'subscribe',
            channels: [channel]
          }));
        });

        logger.info(`客户端 ${client.id} 重连成功`);
      });

      ws.on('error', (error: Error) => {
        client.reconnectAttempts++;
        logger.error(`客户端 ${client.id} 重连失败:`, error);
      });
    } catch (error) {
      client.reconnectAttempts++;
      logger.error(`客户端 ${client.id} 重连异常:`, error);
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client) => {
        if (!client.isAlive) {
          this.handleDisconnection(client);
          return;
        }

        client.isAlive = false;
        client.ws.ping();

        // 检查心跳超时
        if (Date.now() - client.lastPing > this.PING_TIMEOUT) {
          this.handleDisconnection(client);
        }
      });
    }, this.HEARTBEAT_INTERVAL);
  }

  private async startMarketUpdates() {
    this.updateInterval = setInterval(async () => {
      try {
        const updates = await this.getMarketUpdates();
        this.broadcastUpdates(updates);
      } catch (error) {
        logger.error('市场数据更新错误:', error);
      }
    }, 1000); // 每秒更新一次
  }

  private async getMarketUpdates(): Promise<MarketUpdate[]> {
    const updates: MarketUpdate[] = [];
    const timestamp = Date.now();

    try {
      // 获取股票数据更新
      const stockData = await this.marketDataApi.getStockData(['AAPL', 'GOOGL', 'MSFT']);
      updates.push({
        type: 'stocks',
        data: stockData,
        timestamp
      });

      // 获取加密货币数据更新
      const cryptoData = await this.marketDataApi.getCryptoData(['BTC', 'ETH']);
      updates.push({
        type: 'crypto',
        data: cryptoData,
        timestamp
      });

      // 获取市场情绪数据
      const sentimentData = await this.marketDataApi.getMarketSentiment();
      updates.push({
        type: 'sentiment',
        data: sentimentData,
        timestamp
      });
    } catch (error) {
      logger.error('获取市场数据更新失败:', error);
    }

    return updates;
  }

  private broadcastUpdates(updates: MarketUpdate[]) {
    this.clients.forEach(client => {
      updates.forEach(update => {
        if (client.subscriptions.has(update.type)) {
          this.sendToClient(client, update);
        }
      });
    });
  }

  private sendToClient(client: WebSocketClient, message: any) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public stop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.wss.close();
  }

  public getConnectionStats() {
    return {
      total: this.clients.size,
      active: Array.from(this.clients.values()).filter(c => c.isAlive).length,
      dropped: Array.from(this.clients.values()).filter(c => !c.isAlive).length
    };
  }

  public getSubscriptionStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    this.clients.forEach(client => {
      client.subscriptions.forEach(channel => {
        stats[channel] = (stats[channel] || 0) + 1;
      });
    });
    return stats;
  }

  private onError(error: Error) {
    // ... existing code ...
  }

  public broadcast(message: any) {
    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }
} 