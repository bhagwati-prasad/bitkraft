# **ADR-002: Centralized Content Negotiator**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Allowing individual controllers to decide between HTML or JSON leads to:

* Inconsistent behavior
* Duplication of logic
* Difficult debugging

## Decision

Introduce a **Content Negotiator** as a mandatory middleware that:

* Inspects every request
* Decides response mode (HTML or JSON)
* Injects rendering context

Controllers are **render-mode agnostic**.

## Consequences

### Positive

* Single source of truth
* Predictable request behavior
* Easier to evolve rendering logic

### Negative

* Additional abstraction layer
* Slight learning curve for contributors
