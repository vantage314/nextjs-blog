import Redis from 'ioredis';
import { logger } from '../utils/logger';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  ttl?: number;
}

export interface CacheStats {
  hitRate: number;
  missRate: number;
  keys: number;
}

export class CacheService {
  private static instance: CacheService;
  private client: Redis;
  private config: CacheConfig;
  private stats: {
    hits: number;
    misses: number;
  };

  private constructor(config: CacheConfig) {
    this.config = {
      ttl: 3600, // 默认1小时过期
      keyPrefix: 'fincoach:',
      ...config
    };

    this.client = new Redis({
      host: this.config.host,
      port: this.config.port,
      password: this.config.password,
      db: this.config.db,
      keyPrefix: this.config.keyPrefix
    });

    this.stats = {
      hits: 0,
      misses: 0
    };

    this.client.on('error', (error: Error) => {
      logger.error('Redis error:', error);
    });

    this.client.on('connect', () => {
      logger.info('Redis connected');
    });
  }

  public static getInstance(config?: CacheConfig): CacheService {
    if (!CacheService.instance) {
      if (!config) {
        throw new Error('CacheService configuration is required for initialization');
      }
      CacheService.instance = new CacheService(config);
    }
    return CacheService.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (data) {
        this.stats.hits++;
        return JSON.parse(data) as T;
      }
      this.stats.misses++;
      return null;
    } catch (error: unknown) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error: unknown) {
      logger.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error: unknown) {
      logger.error('Cache del error:', error);
    }
  }

  async publish(channel: string, message: any): Promise<void> {
    try {
      await this.client.publish(channel, JSON.stringify(message));
    } catch (error: unknown) {
      logger.error('Cache publish error:', error);
    }
  }

  async getStats(): Promise<CacheStats> {
    try {
      const total = this.stats.hits + this.stats.misses;
      const hitRate = total > 0 ? this.stats.hits / total : 0;
      const missRate = total > 0 ? this.stats.misses / total : 0;
      const keys = await this.client.dbsize();

      return {
        hitRate,
        missRate,
        keys
      };
    } catch (error: unknown) {
      logger.error('Cache stats error:', error);
      return {
        hitRate: 0,
        missRate: 0,
        keys: 0
      };
    }
  }

  async close(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error: unknown) {
      logger.error('Cache close error:', error);
    }
  }

  public async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    try {
      await this.client.subscribe(channel);
      this.client.on('message', (ch: string, message: string) => {
        if (ch === channel) {
          callback(message);
        }
      });
    } catch (error) {
      logger.error('订阅Redis通道失败', { error, channel });
      throw error;
    }
  }
} 