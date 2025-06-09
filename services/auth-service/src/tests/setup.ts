import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from '../config';

let mongoServer: MongoMemoryServer;

// 在所有测试之前设置
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// 在每个测试之后清理
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// 在所有测试之后清理
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// 设置测试超时时间
jest.setTimeout(30000); 