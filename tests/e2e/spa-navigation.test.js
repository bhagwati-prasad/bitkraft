import { test, expect } from '@playwright/test';

test.describe('SPA Navigation Mode', () => {
  test('should navigate without page reload', async ({ page }) => {
    await page.goto('/');
    
    let reloadDetected = false;
    page.on('load', () => {
      reloadDetected = true;
    });
    
    const learnMoreButton = page.locator('a[href="/about"]');
    await learnMoreButton.click();
    
    await page.waitForURL('/about');
    
    expect(reloadDetected).toBe(false);
  });

  test('should send SPA headers in navigation request', async ({ page }) => {
    await page.goto('/');
    
    let spaRequest = null;
    page.on('request', request => {
      if (request.url().endsWith('/about') && request.method() === 'GET') {
        spaRequest = request;
      }
    });
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    expect(spaRequest).not.toBeNull();
    expect(spaRequest.headers()['x-bitkraft-spa']).toBe('true');
    expect(spaRequest.headers()['accept']).toContain('application/json');
  });

  test('should receive JSON response during navigation', async ({ page }) => {
    await page.goto('/');
    
    let jsonResponse = null;
    page.on('response', async response => {
      if (response.url().endsWith('/about') && response.request().method() === 'GET') {
        const contentType = response.headers()['content-type'];
        if (contentType && contentType.includes('application/json')) {
          jsonResponse = await response.json();
        }
      }
    });
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    expect(jsonResponse).not.toBeNull();
    expect(jsonResponse).toHaveProperty('route');
    expect(jsonResponse).toHaveProperty('data');
    expect(jsonResponse).toHaveProperty('meta');
    expect(jsonResponse).toHaveProperty('html');
    expect(jsonResponse).toHaveProperty('timestamp');
    
    expect(jsonResponse.route.path).toBe('/about');
    expect(jsonResponse.route.features).toContain('team');
    expect(jsonResponse.html).toBeTruthy();
  });

  test('should update page title during navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Home - BitKraft/);
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    await expect(page).toHaveTitle(/About - BitKraft/);
  });

  test('should update meta description during navigation', async ({ page }) => {
    await page.goto('/');
    
    const initialDesc = await page.locator('meta[name="description"]').getAttribute('content');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    const newDesc = await page.locator('meta[name="description"]').getAttribute('content');
    
    expect(newDesc).not.toBe(initialDesc);
    expect(newDesc).toContain('BitKraft');
  });

  test('should replace content in #app container', async ({ page }) => {
    await page.goto('/');
    
    const initialContent = await page.locator('#app').innerHTML();
    expect(initialContent).toContain('hero');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    const newContent = await page.locator('#app').innerHTML();
    expect(newContent).not.toBe(initialContent);
    expect(newContent).toContain('team');
    expect(newContent).not.toContain('hero');
  });

  test('should update data-route attribute', async ({ page }) => {
    await page.goto('/');
    
    let route = await page.locator('#app').getAttribute('data-route');
    expect(route).toBe('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    route = await page.locator('#app').getAttribute('data-route');
    expect(route).toBe('/about');
  });

  test('should change content without losing navigation', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toContainText('Welcome to BitKraft');
    
    const nav = page.locator('nav.nav');
    await expect(nav).toBeVisible();
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    await expect(page.locator('h1')).toContainText('About BitKraft');
    
    await expect(nav).toBeVisible();
  });

  test('should navigate multiple times without reload', async ({ page }) => {
    await page.goto('/');
    
    let reloadCount = 0;
    page.on('load', () => {
      reloadCount++;
    });
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    await page.click('a[href="/"]');
    await page.waitForURL('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    expect(reloadCount).toBe(0);
  });

  test('should scroll to top after navigation', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => window.scrollTo(0, 500));
    
    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(0);
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    await page.waitForTimeout(100);
    
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBe(0);
  });

  test('should update browser history', async ({ page }) => {
    await page.goto('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    const url = page.url();
    expect(url).toContain('/about');
    
    const historyLength = await page.evaluate(() => window.history.length);
    expect(historyLength).toBeGreaterThan(1);
  });

  test('should log navigation steps in console', async ({ page }) => {
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        logs.push(msg.text());
      }
    });
    
    await page.goto('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    const navigationLogs = logs.filter(log => log.includes('[Router]'));
    
    expect(navigationLogs.some(log => log.includes('Click detected'))).toBe(true);
    expect(navigationLogs.some(log => log.includes('Navigating to:'))).toBe(true);
    expect(navigationLogs.some(log => log.includes('Payload received'))).toBe(true);
    expect(navigationLogs.some(log => log.includes('Navigation complete'))).toBe(true);
  });
});
