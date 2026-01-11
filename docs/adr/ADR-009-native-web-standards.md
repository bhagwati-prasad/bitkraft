# **ADR-009: Native Web Standards First**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Heavy abstractions often:

* Hide browser behavior
* Increase bundle size
* Reduce debuggability

## Decision

BitKraft uses:

* Vanilla JavaScript
* Native Web APIs
* Web Components (optional)

No dependency on UI frameworks.

## Consequences

### Positive

* Lightweight runtime
* Maximum control
* Future-proof

### Negative

* Less out-of-the-box convenience
* Higher skill expectation
