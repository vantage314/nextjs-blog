import { test, expect } from '@playwright/test';
import { login, expectChartLoaded, mockApiResponse } from './utils/test-utils';

test.describe('投资组合页面', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/portfolio');
  });

  test('加载投资组合数据', async ({ page }) => {
    // 模拟 API 响应
    await mockApiResponse(page, '/api/portfolio/summary', {
      totalValue: 100000,
      dailyChange: 1000,
      dailyChangePercent: 1.0,
    });

    // 验证数据加载
    await expect(page.locator('[data-testid="total-value"]')).toHaveText('¥100,000');
    await expect(page.locator('[data-testid="daily-change"]')).toHaveText('+¥1,000');
    await expect(page.locator('[data-testid="daily-change-percent"]')).toHaveText('+1.00%');
  });

  test('图表加载和交互', async ({ page }) => {
    // 验证图表加载
    await expectChartLoaded(page, 'portfolio-chart');
    await expectChartLoaded(page, 'asset-allocation-chart');

    // 测试图表交互
    await page.hover('[data-testid="portfolio-chart"]');
    await expect(page.locator('.recharts-tooltip-wrapper')).toBeVisible();

    // 测试时间范围切换
    await page.click('button:has-text("1周")');
    await expectChartLoaded(page, 'portfolio-chart');
  });

  test('资产配置展示', async ({ page }) => {
    // 验证资产配置图表
    await expectChartLoaded(page, 'asset-allocation-chart');
    
    // 测试图例交互
    await page.click('[data-testid="asset-legend"] >> text=股票');
    await expect(page.locator('[data-testid="asset-allocation-chart"] .recharts-pie-sector')).toHaveCount(3);
  });

  test('交易记录列表', async ({ page }) => {
    // 验证列表加载
    await expect(page.locator('[data-testid="transaction-list"]')).toBeVisible();
    
    // 测试筛选功能
    await page.selectOption('select[name="transaction-type"]', 'buy');
    await expect(page.locator('[data-testid="transaction-list"] .ant-list-item')).toHaveCount(5);
    
    // 测试排序功能
    await page.click('th:has-text("日期")');
    await expect(page.locator('[data-testid="transaction-list"] .ant-list-item')).toHaveCount(5);
  });

  test('性能指标展示', async ({ page }) => {
    // 验证性能指标加载
    await expect(page.locator('[data-testid="performance-metrics"]')).toBeVisible();
    
    // 验证指标数据
    await expect(page.locator('[data-testid="sharpe-ratio"]')).toHaveText('1.5');
    await expect(page.locator('[data-testid="max-drawdown"]')).toHaveText('-10.5%');
    await expect(page.locator('[data-testid="annual-return"]')).toHaveText('15.2%');
  });
}); 