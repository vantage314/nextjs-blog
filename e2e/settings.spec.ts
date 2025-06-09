import { test, expect } from '@playwright/test';
import { login, expectNotification, expectFormError } from './utils/test-utils';

test.describe('设置页面', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/settings');
  });

  test('更新个人资料', async ({ page }) => {
    // 更新昵称
    await page.fill('input[name="nickname"]', '新昵称');
    await page.click('button:has-text("保存修改")');
    await expectNotification(page, '个人资料更新成功');

    // 验证更新
    await page.reload();
    await expect(page.locator('input[name="nickname"]')).toHaveValue('新昵称');
  });

  test('上传头像', async ({ page }) => {
    // 上传图片
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('button:has-text("更换头像")');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('e2e/fixtures/avatar.jpg');
    await expectNotification(page, '头像上传成功');

    // 验证头像显示
    const avatar = page.locator('img[alt="avatar"]');
    await expect(avatar).toBeVisible();
  });

  test('修改系统设置', async ({ page }) => {
    // 切换主题
    await page.selectOption('select[name="theme"]', 'dark');
    await page.click('button:has-text("保存设置")');
    await expectNotification(page, '设置已保存');

    // 切换语言
    await page.selectOption('select[name="language"]', 'en_US');
    await page.click('button:has-text("保存设置")');
    await expectNotification(page, '设置已保存');

    // 验证设置生效
    await page.reload();
    await expect(page.locator('select[name="theme"]')).toHaveValue('dark');
    await expect(page.locator('select[name="language"]')).toHaveValue('en_US');
  });

  test('通知设置', async ({ page }) => {
    // 启用通知
    await page.check('input[name="notifications.enabled"]');
    await page.check('input[name="notifications.sound"]');
    await page.click('button:has-text("保存设置")');
    await expectNotification(page, '设置已保存');

    // 验证设置
    await page.reload();
    await expect(page.locator('input[name="notifications.enabled"]')).toBeChecked();
    await expect(page.locator('input[name="notifications.sound"]')).toBeChecked();
  });

  test('表单验证', async ({ page }) => {
    // 测试邮箱格式
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button:has-text("保存修改")');
    await expectFormError(page, 'email', '请输入有效的邮箱地址');

    // 测试昵称长度
    await page.fill('input[name="nickname"]', 'a');
    await page.click('button:has-text("保存修改")');
    await expectFormError(page, 'nickname', '昵称长度应在 2-20 个字符之间');
  });
}); 