import { test, expect } from '@playwright/test';

test.describe('认证功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('登录成功', async ({ page }) => {
    // 输入登录信息
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!@#');
    await page.click('button[type="submit"]');

    // 验证登录成功
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=欢迎回来')).toBeVisible();
  });

  test('登录失败 - 密码错误', async ({ page }) => {
    // 输入错误的密码
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrong-password');
    await page.click('button[type="submit"]');

    // 验证错误提示
    await expect(page.locator('text=邮箱或密码错误')).toBeVisible();
  });

  test('注册新用户', async ({ page }) => {
    // 点击注册链接
    await page.click('text=注册新账号');
    await expect(page).toHaveURL('/register');

    // 填写注册信息
    const email = `test${Date.now()}@example.com`;
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'Test123!@#');
    await page.fill('input[name="confirmPassword"]', 'Test123!@#');
    await page.fill('input[name="name"]', '测试用户');
    await page.click('button[type="submit"]');

    // 验证注册成功
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=注册成功')).toBeVisible();
  });

  test('密码重置流程', async ({ page }) => {
    // 点击忘记密码
    await page.click('text=忘记密码？');
    await expect(page).toHaveURL('/forgot-password');

    // 输入邮箱
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // 验证发送成功
    await expect(page.locator('text=重置链接已发送到您的邮箱')).toBeVisible();
  });

  test('记住密码功能', async ({ page }) => {
    // 登录并勾选记住密码
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!@#');
    await page.check('input[name="remember"]');
    await page.click('button[type="submit"]');

    // 验证登录成功
    await expect(page).toHaveURL('/dashboard');

    // 关闭页面后重新打开
    await page.close();
    const newPage = await context.newPage();
    await newPage.goto('/dashboard');

    // 验证仍然保持登录状态
    await expect(newPage).toHaveURL('/dashboard');
    await expect(newPage.locator('text=欢迎回来')).toBeVisible();
  });
}); 