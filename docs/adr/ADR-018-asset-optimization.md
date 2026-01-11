# **ADR-018: Asset Optimization & Delivery**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Web performance depends on:

* Minimized JavaScript/CSS
* Image optimization
* Font loading strategy
* Critical CSS inlining

Poor asset delivery kills performance.

## Decision

BitKraft integrates **asset optimization by default**:

* Vite handles JS/CSS minification and splitting
* Image optimization via plugin
* Critical CSS extraction for SSR
* Preload/prefetch hints for navigation

## Consequences

### Positive

* Fast load times out-of-the-box
* Better Core Web Vitals scores
* Automatic optimization

### Negative

* Build time increases
* Requires understanding of asset pipeline
