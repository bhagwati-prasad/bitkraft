# **ADR-005: Feature-Based Architecture over Page-Based Architecture**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Page-centric architectures tend to:

* Accumulate unrelated logic
* Create "god pages"
* Make reuse difficult

## Decision

BitKraft enforces a **feature-based architecture**:

* A feature owns its UI, state, styles, and logic
* Pages are compositions of features
* Features are lazy-loaded and lifecycle-aware

## Consequences

### Positive

* High modularity
* Easier refactoring
* Better memory isolation

### Negative

* More files per feature
* Requires naming discipline
