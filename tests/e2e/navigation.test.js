/**
 * E2E Navigation Test
 * 
 * Tests SSR to SPA navigation flow.
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load home page with SSR', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Home - BitKraft/);
    
    // Check content is present
    await expect(page.locator('h1')).toContainText('Welcome to BitKraft');
    
    // Check features are initialized
    const features = await page.evaluate(() => {
      return window.__BITKRAFT__?.lifecycleManager.getActiveFeatureNames();
    });
    
    expect(features).toContain('hero');
    expect(features).toContain('footer');
  });
  
  test('should navigate to about page without reload', async ({ page }) => {
    await page.goto('/');
    
    // Track if page reloaded
    let pageReloaded = false;
    page.on('load', () => { pageReloaded = true; });
    
    // Click Learn More button
    await page.click('text=Learn More');
    
    // Wait for navigation
    await page.waitForURL('/about');
    
    // Check title changed
    await expect(page).toHaveTitle(/About - BitKraft/);
    
    // Verify no page reload
    expect(pageReloaded).toBe(false);
    
    // Check content changed
    await expect(page.locator('h1')).toContainText('About BitKraft');
    
    // Check features changed
    const features = await page.evaluate(() => {
      return window.__BITKRAFT__?.lifecycleManager.getActiveFeatureNames();
    });
    
    expect(features).toContain('team');
    expect(features).toContain('footer');
    expect(features).not.toContain('hero');
  });
  
  test('should handle browser back button', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Learn More');
    await page.waitForURL('/about');
    
    // Go back
    await page.goBack();
    await page.waitForURL('/');
    
    // Check we're back on home
    await expect(page).toHaveTitle(/Home - BitKraft/);
    
    const features = await page.evaluate(() => {
      return window.__BITKRAFT__?.lifecycleManager.getActiveFeatureNames();
    });
    
    expect(features).toContain('hero');
  });
  
  test('should handle browser forward button', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Learn More');
    await page.waitForURL('/about');
    await page.goBack();
    await page.waitForURL('/');
    
    // Go forward
    await page.goForward();
    await page.waitForURL('/about');
    
    // Check we're on about
    await expect(page).toHaveTitle(/About - BitKraft/);
  });
  
  test('should cleanup features on navigation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate multiple times
    await page.click('text=Learn More');
    await page.waitForURL('/about');
    
    await page.click('text=Back to Home');
    await page.waitForURL('/');
    
    await page.click('text=Learn More');
    await page.waitForURL('/about');
    
    // Check feature count is correct (not accumulating)
    const featureCount = await page.evaluate(() => {
      return window.__BITKRAFT__?.lifecycleManager.getActiveFeatureCount();
    });
    
    // Should have 2 features (team + footer), not more
    expect(featureCount).toBe(2);
  });
});
