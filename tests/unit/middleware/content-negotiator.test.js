/**
 * Content Negotiator Tests
 * 
 * Tests for SSR/SPA mode decision logic.
 */

import { describe, it, expect } from 'vitest';
import { contentNegotiator } from '../../../src/server/middleware/content-negotiator.js';

describe('ContentNegotiator', () => {
  describe('Bot Detection', () => {
    it('should return SSR mode for Googlebot', () => {
      const req = {
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
        path: '/'
      };
      const res = {};
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      
      contentNegotiator(req, res, next);
      
      expect(req.renderMode).toBe('SSR');
      expect(req.reason).toBe('bot-detected');
      expect(nextCalled).toBe(true);
    });
    
    it('should return SSR mode for Bingbot', () => {
      const req = {
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; bingbot/2.0)' },
        path: '/'
      };
      const res = {};
      const next = () => {};
      
      contentNegotiator(req, res, next);
      
      expect(req.renderMode).toBe('SSR');
      expect(req.reason).toBe('bot-detected');
    });
    
    it('should return SSR mode for case-insensitive bot names', () => {
      const req = {
        headers: { 'user-agent': 'GOOGLEBOT/2.1' },
        path: '/'
      };
      const res = {};
      const next = () => {};
      
      contentNegotiator(req, res, next);
      
      expect(req.renderMode).toBe('SSR');
    });
  });
  
  describe('SPA Navigation Detection', () => {
    it('should return SPA mode when X-BitkRaft-SPA header present', () => {
      const req = {
        headers: {
          'user-agent': 'Mozilla/5.0',
          'x-bitkraft-spa': 'true'
        },
        path: '/about'
      };
      const res = {};
      const next = () => {};
      
      contentNegotiator(req, res, next);
      
      expect(req.renderMode).toBe('SPA');
      expect(req.reason).toBe('spa-navigation');
    });
    
    it('should return SPA mode with alternative header', () => {
      const req = {
        headers: {
          'user-agent': 'Mozilla/5.0',
          'x-spa-navigation': 'true'
        },
        path: '/about'
      };
      const res = {};
      const next = () => {};
      
      contentNegotiator(req, res, next);
      
      expect(req.renderMode).toBe('SPA');
    });
  });
  
  describe('First Load Detection', () => {
    it('should return SSR mode for first load', () => {
      const req = {
        headers: { 'user-agent': 'Mozilla/5.0' },
        path: '/'
      };
      const res = {};
      const next = () => {};
      
      contentNegotiator(req, res, next);
      
      expect(req.renderMode).toBe('SSR');
      expect(req.reason).toBe('first-load');
    });
    
    it('should return SSR mode when no user-agent', () => {
      const req = {
        headers: {},
        path: '/'
      };
      const res = {};
      const next = () => {};
      
      contentNegotiator(req, res, next);
      
      expect(req.renderMode).toBe('SSR');
    });
  });
  
  describe('Priority Order', () => {
    it('should prioritize bot detection over SPA header', () => {
      const req = {
        headers: {
          'user-agent': 'Googlebot',
          'x-bitkraft-spa': 'true'
        },
        path: '/'
      };
      const res = {};
      const next = () => {};
      
      contentNegotiator(req, res, next);
      
      // Bot detection should win
      expect(req.renderMode).toBe('SSR');
      expect(req.reason).toBe('bot-detected');
    });
  });
});
