/**
 * Vitest Setup
 * 
 * Global setup for all tests.
 */

import { beforeAll, afterAll, afterEach } from 'vitest';

// Setup before all tests
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
});

// Cleanup after each test
afterEach(() => {
  // Clear any mocks
  if (global.fetch && global.fetch.mockClear) {
    global.fetch.mockClear();
  }
});

// Cleanup after all tests
afterAll(() => {
  // Final cleanup
});
