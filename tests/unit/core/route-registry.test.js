/**
 * Route Registry Tests
 * 
 * Tests for route lookup and validation.
 */

import { describe, it, expect } from 'vitest';
import { findRoute, getAllRoutes } from '../../../src/server/core/route-registry.js';

describe('RouteRegistry', () => {
  describe('findRoute', () => {
    it('should find home route by path', () => {
      const route = findRoute('/');
      
      expect(route).toBeDefined();
      expect(route.name).toBe('home');
      expect(route.controller).toBe('home');
    });
    
    it('should find about route by path', () => {
      const route = findRoute('/about');
      
      expect(route).toBeDefined();
      expect(route.name).toBe('about');
      expect(route.controller).toBe('about');
    });
    
    it('should return undefined for non-existent route', () => {
      const route = findRoute('/not-found');
      
      expect(route).toBeUndefined();
    });
    
    it('should normalize empty path to /', () => {
      const route = findRoute('');
      
      expect(route).toBeDefined();
      expect(route.path).toBe('/');
    });
    
    it('should include features array', () => {
      const route = findRoute('/');
      
      expect(route.features).toBeInstanceOf(Array);
      expect(route.features.length).toBeGreaterThan(0);
    });
    
    it('should include meta information', () => {
      const route = findRoute('/');
      
      expect(route.meta).toBeDefined();
      expect(route.meta.title).toBeDefined();
      expect(route.meta.description).toBeDefined();
    });
  });
  
  describe('getAllRoutes', () => {
    it('should return array of all routes', () => {
      const routes = getAllRoutes();
      
      expect(routes).toBeInstanceOf(Array);
      expect(routes.length).toBeGreaterThan(0);
    });
    
    it('should include all required route properties', () => {
      const routes = getAllRoutes();
      
      routes.forEach(route => {
        expect(route.path).toBeDefined();
        expect(route.name).toBeDefined();
        expect(route.controller).toBeDefined();
        expect(route.features).toBeInstanceOf(Array);
        expect(route.meta).toBeDefined();
      });
    });
  });
});
