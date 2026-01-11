# **ADR-001: Hybrid Rendering Model (SSR + SPA)**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Traditional SSR applications offer excellent SEO but poor interactivity.
SPAs offer fluid navigation but suffer from SEO issues, hydration complexity, and long-lived memory problems.

A single rendering strategy does not satisfy both requirements.

## Decision

BitKraft adopts a **hybrid rendering model**:

* First load and crawler requests receive **fully rendered HTML**
* Subsequent internal navigation uses **JSON page payloads**
* The rendering mode is decided centrally

## Consequences

### Positive

* 100% SEO compliance
* Instant navigation after first load
* No hydration or DOM reconciliation

### Negative

* More complex routing logic
* Requires strict discipline in rendering consistency
