import { createClient } from 'redis';
import { logger } from '../utils/logger';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');

    redisClient.on('error', (err) => {
      logger.error('Redis error:', err);
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });
  } catch (error) {
    logger.error('Redis connection error:', error);
    process.exit(1);
  }
};

export const getRedisClient = () => redisClient; 