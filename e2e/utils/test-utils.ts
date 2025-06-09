import { Page, expect } from '@playwright/test';

/**
 * 登录测试用户
 */
export const testUser = {
  email: 'test@example.com',
  password: 'test123456',
};

/**
 * 等待页面加载完成
 */
export const waitForPageLoad = async (page: Page) => {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
};

/**
 * 登录操作
 */
export const login = async (page: Page) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="password"]', testUser.password);
  await page.click('button[type="submit"]');
  await waitForPageLoad(page);
  await expect(page).toHaveURL('/dashboard');
};

/**
 * 验证表单错误提示
 */
export const expectFormError = async (page: Page, fieldName: string, errorMessage: string) => {
  const error = page.locator(`[data-testid="${fieldName}-error"]`);
  await expect(error).toBeVisible();
  await expect(error).toHaveText(errorMessage);
};

/**
 * 验证通知消息
 */
export const expectNotification = async (page: Page, message: string) => {
  const notification = page.locator('.ant-notification-notice-message');
  await expect(notification).toBeVisible();
  await expect(notification).toHaveText(message);
};

/**
 * 验证图表加载
 */
export const expectChartLoaded = async (page: Page, chartId: string) => {
  const chart = page.locator(`[data-testid="${chartId}"]`);
  await expect(chart).toBeVisible();
  await expect(chart).toHaveAttribute('data-loaded', 'true');
};

/**
 * 模拟 API 响应
 */
export const mockApiResponse = async (page: Page, url: string, response: any) => {
  await page.route(url, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
};

/**
 * 清理测试数据
 */
export const cleanupTestData = async (page: Page) => {
  // 实现清理逻辑
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}; 