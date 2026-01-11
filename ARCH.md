# BitKraft Framework Architecture

**Version:** 1.0.0-alpha.1  
**Date:** January 11, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Architectural Principles](#architectural-principles)
3. [System Architecture](#system-architecture)
4. [Core Components](#core-components)
5. [Request Lifecycle](#request-lifecycle)
6. [Rendering Pipeline](#rendering-pipeline)
7. [Feature System](#feature-system)
8. [Build System](#build-system)
9. [Extension Points](#extension-points)

---

## Overview

BitKraft is a **hybrid SSR + SPA framework** that combines server-side rendering for initial page loads with client-side navigation for subsequent interactions. Unlike traditional frameworks, it achieves this without hydration or Virtual DOM reconciliation.

### Key Characteristics

- **Dual-mode rendering:** SSR for SEO, SPA for speed
- **Zero hydration:** Server and client render independently
- **Deterministic output:** Identical DOM structure across modes
- **Explicit lifecycle:** Mandatory init/destroy contracts
- **Standards-based:** Native Web APIs, no framework abstractions
- **Frontend efficiency first:** Optimized for minimal client-side overhead

---

## Architectural Principles

### 1. Hybrid Rendering Model

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│     Content     │
│   Negotiator    │◄─── Detects: User-Agent, Headers, First Load
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│  SSR   │ │  SPA   │
│  Mode  │ │  Mode  │
│        │ │        │
│ HTML   │ │ JSON   │
└────────┘ └────────┘
```

### 2. No Hydration

**Traditional Approach (React, Next.js):**
```
Server → HTML → Client receives → Hydrate → Reconcile → Interactive
                                 ↑
                          (Complex, error-prone)
```

**BitKraft Approach:**
```
Server → HTML → Interactive (SSR)
         OR
Client ← JSON ← Render → Interactive (SPA)
         ↑
   (No reconciliation needed)
```

### 3. Feature-Based Architecture

```
App
├── Feature A (owns: UI, state, styles, lifecycle)
├── Feature B
└── Feature C

Each feature is:
- Self-contained
- Lazy-loadable
- Lifecycle-aware
```

---

## System Architecture

### High-Level Components

```
┌───────────────────────────────────────────────────────┐
│                    Client (Browser)                    │
├───────────────────────────────────────────────────────┤
│  SPA Router │ Lifecycle Manager │ Feature Loader      │
└───────────────────────────────────────────────────────┘
                         ▲
                         │ HTTP/JSON
                         ▼
┌───────────────────────────────────────────────────────┐
│                   Server (Node.js)                     │
├───────────────────────────────────────────────────────┤
│  Content Negotiator │ Route Registry │ Cache Manager  │
│  SSR Renderer       │ Asset Resolver │ Middleware     │
└───────────────────────────────────────────────────────┘
                         ▲
                         │
                         ▼
┌───────────────────────────────────────────────────────┐
│                  Build System (Vite)                   │
├───────────────────────────────────────────────────────┤
│  Bundler │ Dev Server │ HMR │ Manifest Generator      │
└───────────────────────────────────────────────────────┘
```

---

## Core Components

### Backend Components

#### 1. Content Negotiator

**Purpose:** Decide rendering mode (SSR or SPA) for each request

**Logic:**
```javascript
function negotiate(req) {
  // First load or crawler → SSR
  if (isCrawler(req) || !req.headers['x-spa-navigation']) {
    return 'SSR';
  }
  // Subsequent navigation → SPA
  return 'SPA';
}
```

**Key:** Controllers never check render mode directly.

#### 2. Route Registry

**Purpose:** Declarative route definitions

```javascript
const routes = [
  {
    path: '/',
    controller: 'home',
    features: ['hero', 'footer']
  },
  {
    path: '/about',
    controller: 'about',
    features: ['team', 'footer']
  }
];
```

#### 3. SSR Renderer

**Purpose:** Generate full HTML documents

- Template engine: EJS
- Injects: Initial state, assets, meta tags
- Output: SEO-friendly HTML

#### 4. Cache Manager

**Purpose:** Multi-layer caching

```
├── HTML Cache (full documents)
├── JSON Cache (page payloads)
└── Tag-based invalidation
```

#### 5. Asset Resolver

**Purpose:** Resolve asset paths in dev and production

- **Dev:** Proxy to Vite dev server
- **Prod:** Read from manifest.json

### Frontend Components

#### 1. SPA Router

**Purpose:** Intercept navigation, fetch JSON, update DOM

```javascript
document.addEventListener('click', (e) => {
  if (e.target.matches('a[href^="/"]')) {
    e.preventDefault();
    navigateTo(e.target.href);
  }
});
```

#### 2. Lifecycle Manager

**Purpose:** Enforce init/destroy on navigation

```javascript
class LifecycleManager {
  async transition(from, to) {
    await this.destroyFeatures(from);
    await this.initFeatures(to);
  }
}
```

#### 3. Feature Loader

**Purpose:** Dynamic import features

```javascript
const feature = await import(`./features/${name}.js`);
await feature.init(context);
```

---

## Request Lifecycle

### SSR Mode (First Load)

```
1. Client requests /page
2. Content Negotiator → SSR mode
3. Route Registry → Find controller
4. Controller → Fetch data
5. SSR Renderer → Generate HTML
6. Cache Manager → Store HTML
7. Response → Full HTML document
8. Client → Parse, execute, interactive
```

### SPA Mode (Navigation)

```
1. User clicks link
2. SPA Router → Intercept
3. Fetch /page with header: x-spa-navigation
4. Content Negotiator → SPA mode
5. Controller → Return JSON payload
6. Cache Manager → Check JSON cache
7. Response → { data, features, meta }
8. Client → Destroy old features
9. Client → Init new features
10. Client → Update DOM
```

---

## Rendering Pipeline

### SSR Pipeline

```
Request
  → Middleware
    → Content Negotiation
      → Route Match
        → Controller Logic
          → Data Fetch
            → Template Render
              → Asset Injection
                → Cache Store
                  → Response
```

### SPA Pipeline

```
Navigation Event
  → SPA Router
    → API Request
      → Content Negotiation
        → Route Match
          → Controller Logic
            → JSON Response
              → Lifecycle Destroy
                → Feature Load
                  → Lifecycle Init
                    → DOM Update
```

---

## Feature System

### Feature Contract

Every feature must export:

```typescript
interface Feature {
  init(context: FeatureContext): Promise<void>;
  destroy(): Promise<void>;
}
```

### Feature Structure

```
features/
└── hero/
    ├── hero.js       # Entry point
    ├── hero.css      # Styles
    ├── hero.html     # Template (optional)
    └── hero.test.js  # Tests
```

### Lifecycle Events

```
Page Load (SSR)
  → DOMContentLoaded
    → feature.init()
    
Navigation (SPA)
  → oldFeature.destroy()
    → Clean up listeners
    → Clear timers
    → Remove DOM refs
  → newFeature.init()
    → Bind events
    → Start timers
    → Update DOM
```

---

## Build System

### Vite Integration

```
Development:
  vite dev server :5173
  → HMR enabled
  → No bundling
  → ESM imports

Production:
  vite build
  → Code splitting
  → Minification
  → Manifest generation
  → Asset optimization
```

### Asset Manifest

```json
{
  "features/hero.js": {
    "file": "assets/hero-abc123.js",
    "css": ["assets/hero-xyz789.css"]
  }
}
```

---

## Extension Points

### 1. Middleware

```javascript
app.use('/api', authMiddleware);
app.use(loggingMiddleware);
```

### 2. Plugins

```javascript
const myPlugin = {
  name: 'my-plugin',
  hooks: {
    'before:render': async (context) => { /* ... */ },
    'after:render': async (html) => { /* ... */ }
  }
};
```

### 3. Custom Routes

```javascript
routes.register({
  path: '/custom',
  controller: customController,
  middleware: [auth, cache(300)]
});
```

---

## Performance Considerations

### Caching Strategy

1. **HTML Cache:** Full documents with TTL
2. **JSON Cache:** Page payloads, tag-invalidated
3. **Asset Cache:** Long-term (immutable)
4. **CDN Integration:** Cache-Control headers

### Memory Management

1. **Explicit cleanup:** destroy() must free resources
2. **Weak references:** For event listeners
3. **Timer cleanup:** clearTimeout/clearInterval
4. **DOM refs:** Nullify on destroy

### Bundle Optimization

1. **Code splitting:** Per feature
2. **Tree shaking:** Remove unused code
3. **Lazy loading:** Features on demand
4. **Critical CSS:** Inline for SSR

---

## Security

### Built-in Protections

- **CSRF tokens:** For state-changing operations
- **XSS prevention:** Template escaping
- **Content Security Policy:** Strict CSP headers
- **Rate limiting:** API endpoints

---

## Observability

### Logging

```javascript
logger.info('Page rendered', { path, duration, renderMode });
logger.error('Feature init failed', { feature, error });
```

### Metrics

- SSR render time
- SPA navigation time
- Cache hit rate
- Feature init/destroy duration

---

## Next Steps

1. Review this architecture document
2. Proceed to Phase 1: Minimal Runtime Kernel
3. Implement core components
4. Validate with test application

---

*This architecture is designed to be simple, predictable, and production-ready.*
