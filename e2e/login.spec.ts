import { test, expect } from '@playwright/test';
import { login, testUser, expectFormError, expectNotification } from './utils/test-utils';

test.describe('登录功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('成功登录', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL('/dashboard');
  });

  test('验证表单错误提示', async ({ page }) => {
    // 测试空邮箱
    await page.click('button[type="submit"]');
    await expectFormError(page, 'email', '请输入邮箱');

    // 测试无效邮箱
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    await expectFormError(page, 'email', '请输入有效的邮箱地址');

    // 测试空密码
    await page.fill('input[name="email"]', testUser.email);
    await page.click('button[type="submit"]');
    await expectFormError(page, 'password', '请输入密码');
  });

  test('登录失败提示', async ({ page }) => {
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', 'wrong-password');
    await page.click('button[type="submit"]');
    await expectNotification(page, '邮箱或密码错误');
  });

  test('记住登录状态', async ({ page }) => {
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.check('input[name="remember"]');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // 刷新页面验证登录状态
    await page.reload();
    await expect(page).toHaveURL('/dashboard');
  });

  test('忘记密码流程', async ({ page }) => {
    await page.click('text=忘记密码？');
    await expect(page).toHaveURL('/forgot-password');
    
    await page.fill('input[name="email"]', testUser.email);
    await page.click('button[type="submit"]');
    await expectNotification(page, '重置密码邮件已发送');
  });
}); 