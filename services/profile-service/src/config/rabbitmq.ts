import amqp from 'amqplib';
import { logger } from '../utils/logger';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost'
    );
    channel = await connection.createChannel();

    // 声明交换机
    await channel.assertExchange('fincoach', 'topic', {
      durable: true
    });

    // 声明队列
    await channel.assertQueue('profile-updates', {
      durable: true
    });

    // 绑定队列到交换机
    await channel.bindQueue('profile-updates', 'fincoach', 'profile.*');

    logger.info('RabbitMQ connected successfully');

    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
    });

    connection.on('close', () => {
      logger.info('RabbitMQ connection closed');
    });
  } catch (error) {
    logger.error('RabbitMQ connection error:', error);
    process.exit(1);
  }
};

export const publishMessage = async (
  routingKey: string,
  message: any
) => {
  try {
    await channel.publish(
      'fincoach',
      routingKey,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true
      }
    );
  } catch (error) {
    logger.error('Error publishing message:', error);
    throw error;
  }
};

export const consumeMessages = async (
  queue: string,
  callback: (message: any) => Promise<void>
) => {
  try {
    await channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await callback(content);
          channel.ack(msg);
        } catch (error) {
          logger.error('Error processing message:', error);
          channel.nack(msg);
        }
      }
    });
  } catch (error) {
    logger.error('Error consuming messages:', error);
    throw error;
  }
}; 