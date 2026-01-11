import { test, expect } from '@playwright/test';

test.describe('SSR Mode - First Load', () => {
  test('should load home page with full SSR HTML', async ({ page }) => {
    const response = await page.goto('/');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    
    await expect(page).toHaveTitle(/Home - BitKraft/);
  });

  test('should have complete HTML document structure', async ({ page }) => {
    await page.goto('/');
    
    const html = await page.content();
    
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('<head>');
    expect(html).toContain('<body>');
    expect(html).toContain('</html>');
  });

  test('should have navigation in SSR response', async ({ page }) => {
    await page.goto('/');
    
    const nav = page.locator('nav.nav');
    await expect(nav).toBeVisible();
    
    const brandLink = nav.locator('a.nav-brand');
    await expect(brandLink).toHaveText('BitKraft');
    
    const homeLink = nav.locator('a[href="/"]');
    await expect(homeLink).toBeVisible();
    
    const aboutLink = nav.locator('a[href="/about"]');
    await expect(aboutLink).toBeVisible();
  });

  test('should have main content with correct data-route', async ({ page }) => {
    await page.goto('/');
    
    const app = page.locator('#app');
    await expect(app).toBeVisible();
    
    const route = await app.getAttribute('data-route');
    expect(route).toBe('/');
  });

  test('should have meta tags in SSR response', async ({ page }) => {
    await page.goto('/');
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description).toContain('BitKraft');
  });

  test('should have CSS loaded', async ({ page }) => {
    await page.goto('/');
    
    const cssLinks = page.locator('link[rel="stylesheet"]');
    await expect(cssLinks).toHaveCount(1);
    
    const cssHref = await cssLinks.getAttribute('href');
    expect(cssHref).toContain('/public/css/main.css');
  });

  test('should have initial state script', async ({ page }) => {
    await page.goto('/');
    
    const stateScript = page.locator('#__BITKRAFT_STATE__');
    await expect(stateScript).toBeAttached();
    
    const stateContent = await stateScript.textContent();
    const state = JSON.parse(stateContent);
    
    expect(state).toHaveProperty('data');
    expect(state).toHaveProperty('route');
    expect(state.route.path).toBe('/');
  });

  test('should have feature elements with data-feature attributes', async ({ page }) => {
    await page.goto('/');
    
    const features = page.locator('[data-feature]');
    const count = await features.count();
    
    expect(count).toBeGreaterThan(0);
    
    const hero = page.locator('[data-feature="hero"]');
    await expect(hero).toBeVisible();
    
    const footer = page.locator('[data-feature="footer"]');
    await expect(footer).toBeVisible();
  });

  test('should initialize BitKraft runtime', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForFunction(() => window.__BITKRAFT__ !== undefined);
    
    const bitkraft = await page.evaluate(() => window.__BITKRAFT__);
    
    expect(bitkraft).toBeDefined();
    expect(bitkraft.version).toBe('1.0.0-alpha.1');
    expect(bitkraft.phase).toBe(1);
  });

  test('should initialize all features', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForFunction(() => {
      return window.__BITKRAFT__?.lifecycleManager.getActiveFeatureCount() > 0;
    });
    
    const activeFeatures = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    
    expect(activeFeatures).toContain('hero');
    expect(activeFeatures).toContain('footer');
  });

  test('should have router initialized', async ({ page }) => {
    await page.goto('/');
    
    const router = await page.evaluate(() => {
      return window.__BITKRAFT__?.router !== undefined;
    });
    
    expect(router).toBe(true);
  });

  test('should have feature-initialized class on features', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('[data-feature="hero"].feature-initialized');
    await page.waitForSelector('[data-feature="footer"].feature-initialized');
    
    const hero = page.locator('[data-feature="hero"]');
    await expect(hero).toHaveClass(/feature-initialized/);
  });

  test('should render home page content', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toContainText('Welcome to BitKraft');
    
    const features = page.locator('.feature-card');
    const count = await features.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render about page content with SSR', async ({ page }) => {
    await page.goto('/about');
    
    await expect(page).toHaveTitle(/About - BitKraft/);
    
    await expect(page.locator('h1')).toContainText('About BitKraft');
    
    const app = page.locator('#app');
    const route = await app.getAttribute('data-route');
    expect(route).toBe('/about');
    
    const activeFeatures = await page.evaluate(() => {
      return window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames();
    });
    
    expect(activeFeatures).toContain('team');
    expect(activeFeatures).toContain('footer');
  });

  test('should handle bot user agents with SSR', async ({ browser }) => {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    });
    const page = await context.newPage();
    
    const response = await page.goto('/');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    
    const html = await page.content();
    expect(html).toContain('<!DOCTYPE html>');
    
    await context.close();
  });
});
