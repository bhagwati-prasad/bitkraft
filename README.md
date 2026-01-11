# BitKraft Framework

**A hybrid SSR + SPA web framework built on Node.js and Vite**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Status](https://img.shields.io/badge/status-alpha-orange)]()

---

## Overview

BitKraft is a modern web framework that combines the SEO benefits of Server-Side Rendering with the fluid navigation of Single-Page Applications — without hydration or Virtual DOM complexity.

### Key Features

- **🔄 Hybrid Rendering** — SSR for first load, SPA for navigation
- **⚡ Zero Hydration** — No reconciliation, no mismatch errors
- **🎯 Lifecycle-First** — Explicit init/destroy for memory safety
- **📦 Feature-Based** — Modular architecture with lazy loading
- **🚀 Performance** — Streaming SSR, aggressive caching, code splitting
- **🛠️ Vite-Powered** — Fast dev experience with HMR
- **📊 Standards-Based** — Vanilla JavaScript, Web APIs, ESM

---

## Quick Start

### Prerequisites

- Node.js ≥18.0.0
- npm, yarn, or pnpm

### Installation

```bash
npm install @bitkraft/framework
```

### Create Your First App

```bash
npx create-bitkraft-app my-app
cd my-app
npm run dev
```

Visit `http://localhost:3000`

---

## Documentation

- **[Specification](SPEC.md)** — Technical specification
- **[Architecture](ARCH.md)** — System architecture overview
- **[ADRs](docs/adr/)** — Architecture Decision Records
- **[Coding Standards](docs/CODING_STANDARDS.md)** — Code guidelines
- **[Contributing](CONTRIBUTING.md)** — How to contribute

---

## Project Status

**Current Phase:** Phase 1 - Minimal Runtime Kernel ✅ **COMPLETE**

BitKraft is in active development. See [Implementation Roadmap](docs/implement/roadmap.md) for timeline.

### Phase 0: Foundation & Governance ✅ COMPLETE
- ✅ Framework specification
- ✅ Architecture documentation
- ✅ ADR system established
- ✅ Coding standards defined

### Phase 1: Minimal Runtime Kernel ✅ COMPLETE
- ✅ Express server with middleware
- ✅ Content Negotiator (SSR/SPA switching)
- ✅ Route Registry with 2 routes
- ✅ SSR Renderer with EJS templates
- ✅ SPA Router with lifecycle management
- ✅ Example features (hero, team, footer)
- ✅ Working hybrid rendering

**Demo:** `npm install && npm run dev` then visit `http://localhost:3000`

### Next Steps
- 🔄 Phase 2: Vite Integration (next)

---

## Testing

BitKraft uses a comprehensive testing strategy with unit, integration, and E2E tests.

### Run Tests

```bash
npx playwright install
npx playwright install-deps

# Run all tests with coverage
npm test

# Run unit tests only
npm run test:unit

# Run E2E tests only
npm run test:e2e

# Run tests in watch mode (TDD)
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Coverage Requirements

- **80%** line coverage for core framework
- **80%** function coverage for core framework
- **75%** branch coverage for core framework

### Test Structure

```
tests/
├── unit/          # Unit tests (Vitest)
├── integration/   # Integration tests (Vitest)
├── e2e/          # End-to-end tests (Playwright)
└── setup.js      # Global test configuration
```

See [CODING_STANDARDS.md](docs/CODING_STANDARDS.md) for TDD guidelines.

---

## Architecture at a Glance

```
┌─────────────────────────────────────┐
│         Client (Browser)            │
│  SPA Router │ Lifecycle │ Features  │
└──────────────┬──────────────────────┘
               │ HTTP/JSON
               ▼
┌─────────────────────────────────────┐
│         Server (Node.js)            │
│  Negotiator │ SSR │ Cache │ Routes  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       Build System (Vite)           │
│  Bundler │ HMR │ Code Splitting     │
└─────────────────────────────────────┘
```

**Core Principle:** Server and client render independently, no hydration needed.

---

## Example

### Define a Feature

```javascript
// features/hero/hero.js
export async function init(context) {
  const { element, data } = context;
  
  element.querySelector('.hero-title').textContent = data.title;
  
  const button = element.querySelector('.cta-button');
  button.addEventListener('click', handleClick);
  
  // Store cleanup reference
  this.cleanup = () => {
    button.removeEventListener('click', handleClick);
  };
}

export async function destroy() {
  // Mandatory cleanup
  this.cleanup?.();
}

function handleClick() {
  console.log('CTA clicked');
}
```

### Register a Route

```javascript
// routes.js
export const routes = [
  {
    path: '/',
    controller: 'home',
    features: ['hero', 'footer'],
    cache: { ttl: 300 }
  }
];
```

### Server renders HTML on first load
### Client fetches JSON on navigation

---

## Philosophy

### What BitKraft Believes

1. **Hydration is unnecessary complexity**
2. **Explicit is better than implicit**
3. **Memory leaks are preventable with discipline**
4. **SEO and UX shouldn't be a trade-off**
5. **Vanilla JavaScript is powerful enough**

### What BitKraft Avoids

- Virtual DOM
- JSX
- Framework-specific abstractions
- Magic behavior
- Implicit state management

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### How to Contribute

1. Read the [Coding Standards](docs/CODING_STANDARDS.md)
2. Check [open issues](https://github.com/bhagwati-prasad/bitkraft/issues)
3. Fork the repository
4. Create a feature branch
5. Submit a pull request

---

## License

MIT License - see [LICENSE](LICENSE) for details

---

## Roadmap

**Version 1.0 Target:** Q2 2026

See detailed [roadmap](docs/implement/roadmap.md) and [phases](docs/implement/phases.md).

---

## Community

- **GitHub:** [bitkraft](https://github.com/bhagwati-prasad/bitkraft)
- **Issues:** [Report bugs](https://github.com/bhagwati-prasad/bitkraft/issues)
- **Discussions:** [Join discussions](https://github.com/bhagwati-prasad/bitkraft/discussions)

---

## Acknowledgments

BitKraft is inspired by:
- Modern SSR frameworks (Next.js, Remix)
- The simplicity of classic server-side rendering
- The lessons learned from hydration complexity

---

**Built with ❤️ by the BitKraft Team**

*Framework for the modern web, without the complexity.*
