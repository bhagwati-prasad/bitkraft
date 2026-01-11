# **ADR-021: Frontend Efficiency as First-Class Concern**

**Status:** Accepted  
**Date:** 2026-01-11

## Context

Modern web applications often suffer from:

* Bloated JavaScript bundles
* Excessive DOM manipulation
* Layout thrashing and reflows
* Unnecessary re-renders
* Poor Core Web Vitals scores
* High Time to Interactive (TTI)

Many frameworks prioritize developer experience over runtime performance, leading to slow, resource-heavy applications that harm user experience, especially on slower devices and networks.

BitKraft aims to be different.

## Decision

BitKraft establishes **frontend efficiency as a first-class architectural concern**, equal in importance to SEO compliance and developer experience.

### Core Mandate

**Every architectural decision, feature implementation, and code contribution MUST consider frontend efficiency.**

### Efficiency Principles

#### 1. Minimal JavaScript Execution

```javascript
// ❌ Bad: Unnecessary framework overhead
const app = React.createElement('div', null, 'Hello');
ReactDOM.render(app, root);

// ✅ Good: Direct DOM manipulation
const element = document.createElement('div');
element.textContent = 'Hello';
container.appendChild(element);
```

**Rule:** No Virtual DOM, no reconciliation, no unnecessary abstractions.

#### 2. Optimized DOM Operations

```javascript
// ❌ Bad: Multiple reflows
for (let item of items) {
  const el = document.createElement('div');
  el.textContent = item;
  container.appendChild(el); // Reflow on each append
}

// ✅ Good: Single reflow
const fragment = document.createDocumentFragment();
for (let item of items) {
  const el = document.createElement('div');
  el.textContent = item;
  fragment.appendChild(el);
}
container.appendChild(fragment); // Single reflow
```

**Rule:** Batch DOM operations, use DocumentFragment, minimize reflows.

#### 3. Layout Thrashing Prevention

```javascript
// ❌ Bad: Read-write-read-write (causes layout thrashing)
element1.style.width = element1.offsetWidth + 10 + 'px';
element2.style.width = element2.offsetWidth + 20 + 'px';

// ✅ Good: Batch reads, then batch writes
const width1 = element1.offsetWidth;
const width2 = element2.offsetWidth;
element1.style.width = width1 + 10 + 'px';
element2.style.width = width2 + 20 + 'px';
```

**Rule:** Separate read and write operations, use requestAnimationFrame when needed.

#### 4. Code Splitting and Lazy Loading

```javascript
// ❌ Bad: Load everything upfront
import { FeatureA, FeatureB, FeatureC } from './features';

// ✅ Good: Load on demand
const loadFeature = (name) => import(`./features/${name}.js`);
```

**Rule:** Features are lazy-loaded, critical path is minimized.

#### 5. Event Delegation

```javascript
// ❌ Bad: Individual listeners
items.forEach(item => {
  item.addEventListener('click', handleClick);
});

// ✅ Good: Single delegated listener
container.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleClick(e);
  }
});
```

**Rule:** Use event delegation, prefer passive listeners when possible.

#### 6. Resource Optimization

- **Images:** Lazy load, use modern formats (WebP, AVIF)
- **Fonts:** Subset, preload critical fonts
- **CSS:** Inline critical CSS, defer non-critical
- **JavaScript:** Tree-shake, minify, compress

**Rule:** Every asset must be optimized by default.

---

## Measurable Targets

BitKraft applications MUST achieve:

### Core Web Vitals

| Metric | Target | Maximum |
|--------|--------|---------|
| **LCP** (Largest Contentful Paint) | < 1.5s | < 2.5s |
| **FID** (First Input Delay) | < 50ms | < 100ms |
| **CLS** (Cumulative Layout Shift) | < 0.05 | < 0.1 |

### Additional Metrics

| Metric | Target |
|--------|--------|
| **TTI** (Time to Interactive) | < 3s on 3G |
| **TBT** (Total Blocking Time) | < 200ms |
| **JS Bundle Size** (initial) | < 50KB gzipped |
| **Feature Bundle Size** | < 20KB gzipped per feature |

---

## Implementation Requirements

### 1. Framework Core

- No Virtual DOM implementation
- No hydration logic
- Minimal runtime overhead (< 10KB gzipped)
- Zero-cost abstractions where possible

### 2. Build System

- Automatic code splitting by feature
- Tree shaking enabled by default
- Minification and compression mandatory
- Asset optimization built-in

### 3. Developer Tools

- Performance budgets enforced in CI
- Bundle size analysis on every build
- Lighthouse CI integration
- Real User Monitoring (RUM) hooks

### 4. Feature Development

Every feature MUST:
- Profile performance before and after changes
- Document performance characteristics
- Stay within bundle size budget
- Pass Lighthouse audits (score ≥ 90)

---

## Code Review Checklist

Before merging, verify:

- [ ] No unnecessary DOM queries in loops
- [ ] Event listeners use delegation where appropriate
- [ ] DOM operations are batched
- [ ] No layout thrashing (read/write separation)
- [ ] Lazy loading used for non-critical features
- [ ] Bundle size impact measured and acceptable
- [ ] Performance regression tests pass

---

## Consequences

### ✅ Positive

1. **Fast applications by default** — Users get excellent experience
2. **Better SEO** — Fast sites rank higher
3. **Lower infrastructure costs** — Less client-side computation
4. **Competitive advantage** — Speed as a feature
5. **User retention** — Fast apps retain users better

### ⚠️ Negative

1. **Higher bar for contributors** — Must understand performance
2. **More code review time** — Performance must be verified
3. **Learning curve** — Developers used to frameworks may struggle
4. **Manual optimization** — Less "magic" compared to React/Vue

### 🔄 Mitigations

- **Performance guides** in documentation
- **Linting rules** to catch common issues
- **Automated checks** in CI/CD
- **Example patterns** for common scenarios
- **Performance workshops** for contributors

---

## Tools and Monitoring

### Development Tools

- **Chrome DevTools Performance tab** — Mandatory for profiling
- **Lighthouse** — Score ≥ 90 required
- **Bundle Analyzer** — Visualize bundle composition
- **Performance observer** — Built into framework

### Production Monitoring

```javascript
// Built-in performance tracking
const perfObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'feature-init') {
      logger.info('Feature init time', {
        feature: entry.detail.name,
        duration: entry.duration
      });
    }
  }
});
perfObserver.observe({ entryTypes: ['measure'] });
```

---

## Examples

### Good: Efficient Feature Implementation

```javascript
export class Hero {
  async init(context) {
    const { element, data } = context;
    
    // Single DOM query
    this.cta = element.querySelector('.cta-button');
    
    // Passive listener
    this.handleClick = this.handleClick.bind(this);
    this.cta.addEventListener('click', this.handleClick, { passive: true });
    
    // Performance mark
    performance.mark('hero-init-complete');
  }
  
  async destroy() {
    // Clean up listener
    this.cta.removeEventListener('click', this.handleClick);
    this.cta = null;
  }
  
  handleClick() {
    // Handle click
  }
}
```

### Bad: Inefficient Implementation

```javascript
// ❌ Multiple issues
export class Hero {
  init(context) {
    // Issue 1: No cleanup mechanism
    document.querySelector('.cta-button').addEventListener('click', () => {
      // Issue 2: DOM query inside handler
      const title = document.querySelector('.title');
      
      // Issue 3: Multiple reflows
      title.style.fontSize = '20px';
      const height = title.offsetHeight; // Read
      title.style.marginTop = height + 'px'; // Write
      
      // Issue 4: Not using passive listener
    });
  }
  
  // Issue 5: No destroy method
}
```

---

## Alternatives Considered

### Alternative 1: Virtual DOM with Optimizations

**Rejected because:**
- Still adds runtime overhead
- Complexity for optimization is high
- Conflicts with "no hydration" principle

### Alternative 2: No Performance Requirements

**Rejected because:**
- Would allow performance regressions
- Conflicts with "performance-first" principle
- User experience would suffer

### Alternative 3: Framework-Specific Optimizations

**Rejected because:**
- Would require framework dependency
- Loses control over performance characteristics
- Less transparent to developers

---

## References

- [Web Vitals](https://web.dev/vitals/)
- [Rendering Performance](https://web.dev/rendering-performance/)
- [JavaScript Performance](https://web.dev/fast/)
- [ADR-003: No Hydration and No Virtual DOM](ADR-003-no-hydration-no-vdom.md)
- [ADR-018: Asset Optimization & Delivery](ADR-018-asset-optimization.md)

---

## Approval

**Status:** ✅ **ACCEPTED**

Frontend efficiency is now a **first-class architectural concern** in BitKraft Framework.

All code contributions must demonstrate consideration for frontend performance.

---

*This ADR establishes frontend efficiency as non-negotiable for v1.x.*
