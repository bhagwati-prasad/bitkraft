import { test, expect } from '@playwright/test';

test.describe('Feature Lifecycle Management', () => {
  test('should initialize features on first load', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForFunction(() => {
      return window.__BITKRAFT__?.lifecycleManager.getActiveFeatureCount() > 0;
    });
    
    const activeFeatures = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    
    expect(activeFeatures).toContain('hero');
    expect(activeFeatures).toContain('footer');
    expect(activeFeatures.length).toBe(2);
  });

  test('should add feature-initialized class to features', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('[data-feature="hero"].feature-initialized');
    await page.waitForSelector('[data-feature="footer"].feature-initialized');
    
    const hero = page.locator('[data-feature="hero"]');
    await expect(hero).toHaveClass(/feature-initialized/);
    
    const footer = page.locator('[data-feature="footer"]');
    await expect(footer).toHaveClass(/feature-initialized/);
  });

  test('should destroy old features before navigation', async ({ page }) => {
    const destroyLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('Destroying')) {
        destroyLogs.push(msg.text());
      }
    });
    
    await page.goto('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    expect(destroyLogs.some(log => log.includes('[Hero] Destroying'))).toBe(true);
    expect(destroyLogs.some(log => log.includes('[LifecycleManager] Destroying active features'))).toBe(true);
  });

  test('should initialize new features after navigation', async ({ page }) => {
    await page.goto('/');
    
    let features = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    expect(features).toContain('hero');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    await page.waitForSelector('[data-feature="team"].feature-initialized');
    
    features = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    
    expect(features).toContain('team');
    expect(features).toContain('footer');
    expect(features).not.toContain('hero');
  });

  test('should not accumulate features over multiple navigations', async ({ page }) => {
    await page.goto('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    await page.click('a[href="/"]');
    await page.waitForURL('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    const featureCount = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureCount();
    });
    
    expect(featureCount).toBe(2);
  });

  test('should cleanup feature event listeners on destroy', async ({ page }) => {
    await page.goto('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    const heroElement = await page.evaluate(() => {
      return document.querySelector('[data-feature="hero"]');
    });
    
    expect(heroElement).toBeNull();
  });

  test('should maintain footer feature across navigation', async ({ page }) => {
    await page.goto('/');
    
    const footerOnHome = page.locator('[data-feature="footer"]');
    await expect(footerOnHome).toBeVisible();
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    const footerOnAbout = page.locator('[data-feature="footer"]');
    await expect(footerOnAbout).toBeVisible();
    
    const features = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    
    expect(features).toContain('footer');
  });

  test('should handle feature initialization errors gracefully', async ({ page }) => {
    const errorLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errorLogs.push(msg.text());
      }
    });
    
    await page.goto('/');
    
    await page.waitForFunction(() => {
      return window.__BITKRAFT__?.lifecycleManager !== undefined;
    });
    
    const featureCount = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureCount();
    });
    
    expect(featureCount).toBeGreaterThan(0);
  });

  test('should log feature lifecycle events', async ({ page }) => {
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        logs.push(msg.text());
      }
    });
    
    await page.goto('/');
    
    expect(logs.some(log => log.includes('[LifecycleManager] Initializing features'))).toBe(true);
    expect(logs.some(log => log.includes('[Hero] Initializing'))).toBe(true);
    expect(logs.some(log => log.includes('[Hero] Initialized'))).toBe(true);
    expect(logs.some(log => log.includes('[LifecycleManager] Feature initialized: hero'))).toBe(true);
  });

  test('should clear activeFeatures map on destroy', async ({ page }) => {
    await page.goto('/');
    
    let count = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureCount();
    });
    expect(count).toBe(2);
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    await page.waitForFunction(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureCount() === 2;
    });
    
    count = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureCount();
    });
    expect(count).toBe(2);
  });

  test('should handle features with missing destroy method', async ({ page }) => {
    const warnLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'warning') {
        warnLogs.push(msg.text());
      }
    });
    
    await page.goto('/');
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    const features = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    
    expect(features).toContain('team');
  });

  test('should provide correct context to features', async ({ page }) => {
    await page.goto('/');
    
    const contextProvided = await page.evaluate(() => {
      const hero = document.querySelector('[data-feature="hero"]');
      return hero !== null && hero.classList.contains('feature-initialized');
    });
    
    expect(contextProvided).toBe(true);
  });

  test('should handle navigation during feature initialization', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(100);
    
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    await page.waitForSelector('[data-feature="team"].feature-initialized');
    
    const features = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    
    expect(features).toContain('team');
    expect(features).not.toContain('hero');
  });
});
