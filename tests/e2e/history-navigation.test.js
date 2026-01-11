import { test, expect } from '@playwright/test';

test.describe('Browser History Navigation', () => {
  test('should handle back button navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Home - BitKraft/);
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    await expect(page).toHaveTitle(/About - BitKraft/);
    
    let reloadDetected = false;
    page.on('load', () => {
      reloadDetected = true;
    });
    
    await page.goBack();
    await page.waitForURL('/');
    
    expect(reloadDetected).toBe(false);
    await expect(page).toHaveTitle(/Home - BitKraft/);
  });

  test('should restore page content on back', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome to BitKraft');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    await expect(page.locator('h1')).toContainText('About BitKraft');
    
    await page.goBack();
    await page.waitForURL('/');
    
    await expect(page.locator('h1')).toContainText('Welcome to BitKraft');
    
    const features = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    
    expect(features).toContain('hero');
    expect(features).not.toContain('team');
  });

  test('should handle forward button navigation', async ({ page }) => {
    await page.goto('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    await page.goBack();
    await page.waitForURL('/');
    
    let reloadDetected = false;
    page.on('load', () => {
      reloadDetected = true;
    });
    
    await page.goForward();
    await page.waitForURL('/about');
    
    expect(reloadDetected).toBe(false);
    await expect(page).toHaveTitle(/About - BitKraft/);
    await expect(page.locator('h1')).toContainText('About BitKraft');
  });

  test('should handle multiple back/forward navigations', async ({ page }) => {
    await page.goto('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    await page.click('a[href="/"]');
    await page.waitForURL('/');
    
    await page.goBack();
    await page.waitForURL('/about');
    await expect(page).toHaveTitle(/About - BitKraft/);
    
    await page.goBack();
    await page.waitForURL('/');
    await expect(page).toHaveTitle(/Home - BitKraft/);
    
    await page.goForward();
    await page.waitForURL('/about');
    await expect(page).toHaveTitle(/About - BitKraft/);
  });

  test('should maintain correct feature state through history', async ({ page }) => {
    await page.goto('/');
    
    let homeFeatures = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    expect(homeFeatures).toContain('hero');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    let aboutFeatures = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    expect(aboutFeatures).toContain('team');
    expect(aboutFeatures).not.toContain('hero');
    
    await page.goBack();
    await page.waitForURL('/');
    
    homeFeatures = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    expect(homeFeatures).toContain('hero');
    expect(homeFeatures).not.toContain('team');
  });

  test('should update data-route on history navigation', async ({ page }) => {
    await page.goto('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    let route = await page.locator('#app').getAttribute('data-route');
    expect(route).toBe('/about');
    
    await page.goBack();
    await page.waitForURL('/');
    
    route = await page.locator('#app').getAttribute('data-route');
    expect(route).toBe('/');
  });

  test('should prevent duplicate navigation on same route', async ({ page }) => {
    await page.goto('/');
    
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('[Router]')) {
        logs.push(msg.text());
      }
    });
    
    await page.click('a[href="/"]');
    
    await page.waitForTimeout(500);
    
    const alreadyOnRoute = logs.some(log => log.includes('Already on route'));
    expect(alreadyOnRoute).toBe(true);
  });

  test('should handle rapid back/forward clicks', async ({ page }) => {
    await page.goto('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    await page.goBack();
    await page.goForward();
    await page.goBack();
    
    await page.waitForURL('/');
    
    await expect(page).toHaveTitle(/Home - BitKraft/);
    
    const features = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    
    expect(features).toContain('hero');
  });
});
