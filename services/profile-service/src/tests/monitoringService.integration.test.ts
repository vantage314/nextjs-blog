import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { MonitoringService } from '../services/monitoringService';
import { CacheService } from '../services/cacheService';
import { WebSocketService } from '../services/websocketService';
import { createServer } from 'http';
import { performance } from 'perf_hooks';

jest.mock('../services/cacheService');
jest.mock('../services/websocketService');

describe('MonitoringService Integration', () => {
  let mongoServer: MongoMemoryServer;
  let server: any;
  let monitoringService: MonitoringService;
  let cacheService: CacheService;
  let wsService: WebSocketService;

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
    cacheService = CacheService.getInstance();
    wsService = WebSocketService.getInstance(server);
    monitoringService = MonitoringService.getInstance();
  });

  afterEach(() => {
    monitoringService.stop();
  });

  describe('系统指标监控', () => {
    it('应该正确收集CPU使用率', async () => {
      const metrics = monitoringService.getMetrics();
      expect(metrics.systemMetrics.cpu.usage).toBeGreaterThanOrEqual(0);
      expect(metrics.systemMetrics.cpu.usage).toBeLessThanOrEqual(1);
      expect(metrics.systemMetrics.cpu.loadAvg).toHaveLength(3);
    });

    it('应该正确收集内存使用情况', async () => {
      const metrics = monitoringService.getMetrics();
      expect(metrics.systemMetrics.memory.total).toBeGreaterThan(0);
      expect(metrics.systemMetrics.memory.free).toBeGreaterThan(0);
      expect(metrics.systemMetrics.memory.used).toBeGreaterThan(0);
      expect(metrics.systemMetrics.memory.usagePercent).toBeGreaterThanOrEqual(0);
      expect(metrics.systemMetrics.memory.usagePercent).toBeLessThanOrEqual(1);
    });

    it('应该正确收集网络统计信息', async () => {
      const metrics = monitoringService.getMetrics();
      expect(metrics.systemMetrics.network.bytesIn).toBeGreaterThanOrEqual(0);
      expect(metrics.systemMetrics.network.bytesOut).toBeGreaterThanOrEqual(0);
      expect(metrics.systemMetrics.network.connections).toBeGreaterThanOrEqual(0);
    });
  });

  describe('业务指标监控', () => {
    it('应该正确记录API延迟', async () => {
      const startTime = performance.now();
      await monitoringService.recordApiLatency('test_api', startTime);
      
      const metrics = monitoringService.getMetrics();
      expect(metrics.apiLatency['test_api']).toBeDefined();
      expect(metrics.apiLatency['test_api']).toBeGreaterThan(0);
    });

    it('应该正确计算缓存命中率', async () => {
      await monitoringService.recordCacheHit();
      await monitoringService.recordCacheHit();
      await monitoringService.recordCacheMiss();

      const metrics = monitoringService.getMetrics();
      expect(metrics.cacheHitRate).toBe(2/3);
    });

    it('应该正确跟踪WebSocket连接', async () => {
      await monitoringService.recordWsConnection();
      await monitoringService.recordWsConnection();
      await monitoringService.recordWsDisconnection();

      const metrics = monitoringService.getMetrics();
      expect(metrics.wsConnections.total).toBe(2);
      expect(metrics.wsConnections.active).toBe(1);
    });
  });

  describe('告警规则', () => {
    it('应该在CPU使用率过高时触发告警', async () => {
      const metrics = monitoringService.getMetrics();
      metrics.systemMetrics.cpu.usage = 0.9;

      const alertRules = monitoringService.getAlertRules();
      const cpuRule = alertRules.find(rule => rule.id === 'high_cpu_usage');
      
      expect(cpuRule).toBeDefined();
      expect(cpuRule?.condition(metrics)).toBe(true);
    });

    it('应该在内存使用率过高时触发告警', async () => {
      const metrics = monitoringService.getMetrics();
      metrics.memoryUsage.heapUsed = metrics.memoryUsage.heapTotal * 0.9;

      const alertRules = monitoringService.getAlertRules();
      const memoryRule = alertRules.find(rule => rule.id === 'high_memory_usage');
      
      expect(memoryRule).toBeDefined();
      expect(memoryRule?.condition(metrics)).toBe(true);
    });

    it('应该在错误率过高时触发告警', async () => {
      const metrics = monitoringService.getMetrics();
      metrics.businessMetrics.errorRate = 0.1;

      const alertRules = monitoringService.getAlertRules();
      const errorRule = alertRules.find(rule => rule.id === 'high_error_rate');
      
      expect(errorRule).toBeDefined();
      expect(errorRule?.condition(metrics)).toBe(true);
    });
  });

  describe('数据持久化', () => {
    it('应该将指标数据保存到Redis', async () => {
      const metrics = monitoringService.getMetrics();
      expect(cacheService.set).toHaveBeenCalledWith(
        expect.stringMatching(/^metrics:\d+$/),
        metrics,
        3600
      );
    });

    it('应该通过WebSocket广播指标更新', async () => {
      const metrics = monitoringService.getMetrics();
      expect(wsService.broadcast).toHaveBeenCalledWith({
        type: 'metrics',
        data: metrics,
        timestamp: expect.any(Number)
      });
    });
  });

  describe('自定义告警规则', () => {
    it('应该能够添加新的告警规则', () => {
      const newRule = {
        id: 'custom_rule',
        name: '自定义规则',
        condition: (metrics: any) => metrics.businessMetrics.activeUsers > 1000,
        severity: 'warning' as const,
        message: '活跃用户数超过1000'
      };

      monitoringService.addAlertRule(newRule);
      const rules = monitoringService.getAlertRules();
      expect(rules).toContainEqual(newRule);
    });

    it('应该能够删除告警规则', () => {
      const ruleId = 'high_cpu_usage';
      monitoringService.removeAlertRule(ruleId);
      const rules = monitoringService.getAlertRules();
      expect(rules.find(rule => rule.id === ruleId)).toBeUndefined();
    });
  });

  describe('性能指标聚合', () => {
    it('应该正确计算平均响应时间', async () => {
      const startTime1 = performance.now();
      await monitoringService.recordApiLatency('api1', startTime1);
      
      const startTime2 = performance.now();
      await monitoringService.recordApiLatency('api2', startTime2);

      const metrics = monitoringService.getMetrics();
      const avgLatency = Object.values(metrics.apiLatency).reduce((a, b) => a + b, 0) / 
        Object.keys(metrics.apiLatency).length;
      
      expect(avgLatency).toBeGreaterThan(0);
    });

    it('应该正确计算预取成功率', async () => {
      await monitoringService.recordPrefetchSuccess('stocks');
      await monitoringService.recordPrefetchSuccess('forex');
      await monitoringService.recordPrefetchFailure('options');

      const metrics = monitoringService.getMetrics();
      expect(metrics.businessMetrics.prefetchMetrics.successRate).toBe(2/3);
    });
  });
}); 