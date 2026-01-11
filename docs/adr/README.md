# Architecture Decision Records (ADRs)

This directory contains the Architecture Decision Records for **BitKraft Framework v1.0**.

These ADRs are **framework-level**, app-agnostic, and written so that:

* New contributors understand *why* decisions were made
* Future changes can be evaluated against original intent
* The framework can evolve without architectural drift

## Big Picture

BitKraft is a **hybrid SSR + SPA framework** built on these principles:

1. **No Hydration, No Virtual DOM** — Clean, deterministic rendering without reconciliation overhead
2. **Feature-Based Architecture** — Modular, lifecycle-aware components that own their state and behavior
3. **Content Negotiation** — Automatic HTML/JSON switching based on request context
4. **Performance First** — Streaming SSR, aggressive caching, and optimized asset delivery
5. **Frontend Efficiency Critical** — Every byte, operation, and render is optimized for speed
6. **Standards-Based** — Vanilla JavaScript, Web APIs, and ESM-native tooling
7. **Test-Driven Development** — Tests first, high coverage, confidence in changes
8. **Developer Experience** — Fast feedback loops, type safety, and clear error messages

The framework is designed for **production-grade web applications** that demand both SEO excellence and fluid user experiences, without the complexity of traditional React-style frameworks.

## ADR Index

### Foundation (0001)
- [ADR-0001: Framework Scope & Boundaries](ADR-0001-framework-scope.md)

### Mandatory requirement for Non-auth pages
- [ADR-0002: Search engine optimization checks](ADR-0002-search-engine-optimization.md)

### Core Architecture (001-009)
- [ADR-001: Hybrid Rendering Model (SSR + SPA)](ADR-001-hybrid-rendering-model.md)
- [ADR-002: Centralized Content Negotiator](ADR-002-content-negotiator.md)
- [ADR-003: No Hydration and No Virtual DOM](ADR-003-no-hydration-no-vdom.md)
- [ADR-004: Vite as the Official Bundler](ADR-004-vite-as-bundler.md)
- [ADR-005: Feature-Based Architecture over Page-Based Architecture](ADR-005-feature-based-architecture.md)
- [ADR-006: Explicit Lifecycle & Memory Hygiene](ADR-006-lifecycle-and-memory-hygiene.md)
- [ADR-007: JSON Page Payloads Instead of HTML Fragments](ADR-007-json-page-payloads.md)
- [ADR-008: Aggressive Multi-Layer Caching](ADR-008-caching-strategy.md)
- [ADR-009: Native Web Standards First](ADR-009-native-web-standards.md)

### Extensions & Integrations (010-020)
- [ADR-010: Plugin System Architecture](ADR-010-plugin-system.md)
- [ADR-011: Authentication & Authorization Strategy](ADR-011-authentication-strategy.md)
- [ADR-012: SSR Streaming for Progressive Rendering](ADR-012-ssr-streaming.md)
- [ADR-013: Error Handling & Recovery](ADR-013-error-handling.md)
- [ADR-014: Configuration Management](ADR-014-configuration-management.md)
- [ADR-015: Logging & Observability](ADR-015-logging-observability.md)
- [ADR-016: Testing Strategy](ADR-016-testing-strategy.md)
- [ADR-017: Internationalization (i18n) Support](ADR-017-internationalization.md)
- [ADR-018: Asset Optimization & Delivery](ADR-018-asset-optimization.md)
- [ADR-019: State Management Patterns](ADR-019-state-management.md)
- [ADR-020: Development Tooling & Developer Experience](ADR-020-development-tooling.md)
- [ADR-021: Frontend Efficiency as First-Class Concern](ADR-021-frontend-efficiency.md)

## Guiding Principle

These ADRs form the **architectural constitution** of BitKraft.

Any future proposal should answer:

> *Does this align with existing ADRs, or does it intentionally replace one?*
