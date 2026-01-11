# **ADR-0001: Framework Scope & Boundaries**

**Status:** Accepted  
**Date:** 2026-01-11  
**Decision Makers:** BitKraft Core Team

---

## Context

Before implementing any code, we must clearly define:

1. **What BitKraft is** — Its purpose and positioning
2. **What BitKraft is NOT** — Explicit non-goals to prevent scope creep
3. **Target use cases** — Who should use this framework
4. **Design constraints** — Non-negotiable technical boundaries

Without these boundaries, the framework risks becoming:
- Overly complex
- Unfocused
- Difficult to maintain
- Competitive with existing solutions in unclear ways

This ADR establishes the **constitutional scope** of BitKraft Framework v1.0.

---

## Decision

### ✅ What BitKraft IS

#### 1. A Hybrid SSR + SPA Framework

BitKraft is a **web application framework** that:
- Renders full HTML on first load (SEO-optimized)
- Switches to SPA mode for subsequent navigation (speed-optimized)
- Decides rendering mode automatically via Content Negotiation

#### 2. Built on Modern Standards

- **Backend:** Node.js (≥18) + Express
- **Frontend:** Vanilla JavaScript + Web APIs
- **Build:** Vite (ESM-native)
- **Templates:** EJS (server-side)
- **No framework dependencies:** React, Vue, Angular, etc.

#### 3. A Lifecycle-First Architecture

- Every page/feature **must** implement `init()` and `destroy()`
- Memory hygiene is **mandatory**, not optional
- Long-running SPA sessions must remain stable

#### 4. Performance-Oriented with Frontend Efficiency as Priority

- **Frontend efficiency is paramount** — Every byte and millisecond matters
- Aggressive multi-layer caching (HTML, JSON, assets)
- Streaming SSR for progressive rendering
- Feature-level code splitting
- Asset optimization by default
- Minimal JavaScript execution on client
- Optimized DOM operations and rendering

#### 5. Test-Driven Development

- **Tests before code** — Write tests first, then implementation
- High test coverage (>80% for core framework)
- Fast test execution (<5s for unit tests)
- Integration and E2E tests for critical paths
- Tests as documentation and specification

#### 5. Plugin-Extensible

- Core remains minimal
- Functionality added via plugins
- Community can extend without forking

---

### ❌ What BitKraft is NOT

#### 1. NOT a Virtual DOM Framework

- No reconciliation
- No diffing
- No client-side rendering of server HTML

**Why:** Virtual DOM adds complexity and runtime cost. BitKraft renders deterministically without needing reconciliation.

#### 2. NOT a Hydration-Based System

- Server HTML and client JS are **independent**
- No "hydration mismatch" errors possible

**Why:** Hydration is error-prone and adds overhead. BitKraft avoids it entirely.

#### 3. NOT a Full-Stack Framework

- No built-in database layer
- No ORM
- No authentication provider

**Why:** These are application concerns, not framework concerns. BitKraft provides hooks, not implementations.

#### 4. NOT a UI Component Library

- No pre-built buttons, forms, modals
- No CSS framework included

**Why:** UI is subjective. Developers bring their own or use plugins.

#### 5. NOT a Static Site Generator

- Requires a running Node.js server
- Cannot export to static HTML files

**Why:** BitKraft is for **dynamic web applications**, not static sites.

#### 6. NOT Opinionated About State Management

- No built-in Redux/MobX/etc.
- Features manage their own state

**Why:** State management needs vary. BitKraft allows any approach.

---

### 🎯 Target Use Cases

BitKraft is designed for:

✅ **Content-heavy applications** (blogs, documentation, e-commerce)  
✅ **SaaS dashboards** with SEO landing pages  
✅ **Corporate websites** with interactive features  
✅ **Learning platforms** with rich navigation  
✅ **Marketplaces** needing SEO + UX  

BitKraft is **NOT** ideal for:

❌ Static marketing sites (use Astro, 11ty)  
❌ Real-time collaboration tools (use WebSockets-first frameworks)  
❌ Mobile-first apps (use React Native, Flutter)  
❌ Desktop applications (use Electron, Tauri)  

---

### 🚧 Design Constraints

These are **non-negotiable architectural rules**:

#### 1. No Breaking Changes to Core Contracts

Once published, these interfaces are **immutable in v1.x**:

- Feature lifecycle (`init`, `destroy`)
- Content Negotiator headers
- Route registry schema
- Plugin API surface

#### 2. Node.js ≥18 Required

- Uses native ESM
- Uses fetch API (Node 18+)
- No CommonJS support

#### 3. Modern Browser Target

- No IE11 support
- No polyfills for legacy browsers
- Baseline: ES2020, ESM imports

#### 4. Zero Client-Side Framework Dependencies

- No React
- No Vue
- No Angular
- No Svelte

**Exception:** Plugins may use frameworks internally, but core must not.

#### 5. Explicit Over Implicit

- No magic globals
- No hidden state
- No automatic behavior without declaration

---

## Consequences

### ✅ Positive

1. **Clear positioning** — Easy to explain what BitKraft does
2. **Focused development** — No feature creep
3. **Maintainability** — Smaller surface area
4. **Performance** — Fewer abstractions = faster runtime
5. **Adoption** — Developers know what they're getting

### ⚠️ Negative

1. **Less "batteries included"** — Developers must integrate auth, DB, etc.
2. **Learning curve** — Lifecycle discipline requires training
3. **Modern-only** — Cannot support legacy environments
4. **Smaller ecosystem** — Fewer plugins initially vs. established frameworks

### 🔄 Mitigations

- **Detailed documentation** to reduce learning curve
- **Plugin ecosystem** to fill gaps
- **Migration guides** from React/Next.js
- **Example applications** for common patterns

---

## Alternatives Considered

### Alternative 1: Include Virtual DOM

**Rejected because:**
- Adds significant complexity
- Conflicts with "no hydration" goal
- Makes framework similar to existing solutions

### Alternative 2: Build on Existing Frameworks (Next.js, Remix)

**Rejected because:**
- Would inherit hydration complexity
- Would lose control over lifecycle
- Would not achieve "no Virtual DOM" goal

### Alternative 3: Support Static Export

**Rejected because:**
- SPA navigation requires server
- Content negotiation needs runtime logic
- Would dilute focus

---

## Open Questions

### 1. Streaming SSR Implementation

**Question:** Should streaming be mandatory or opt-in?

**Answer:** Opt-in with fallback to buffered mode (addressed in ADR-012)

### 2. TypeScript Requirement

**Question:** Should TypeScript be mandatory for framework code?

**Answer:** Yes for framework, optional for applications (addressed in ADR-020)

### 3. Monorepo Structure

**Question:** Should framework be a monorepo?

**Answer:** Yes, using npm workspaces (addressed in Phase 0)

---

## References

- [SPEC.md](../../SPEC.md) — Full technical specification
- [ARCH.md](../../ARCH.md) — Architecture overview
- [ADR-003: No Hydration and No Virtual DOM](ADR-003-no-hydration-no-vdom.md)
- [ADR-005: Feature-Based Architecture](ADR-005-feature-based-architecture.md)

---

## Approval

**Status:** ✅ **ACCEPTED**

This ADR establishes the foundational scope for BitKraft Framework v1.0.

All future work must align with these boundaries or propose amendments via new ADRs.

---

## Amendments

| Date | ADR | Change |
|------|-----|--------|
| (none yet) | | |

---

*This ADR is binding for v1.x releases.*
