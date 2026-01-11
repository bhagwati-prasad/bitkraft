# **ADR-003: No Hydration and No Virtual DOM**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Hydration and Virtual DOM systems:

* Add runtime cost
* Introduce mismatch bugs
* Obscure performance characteristics
* Increase memory pressure in long sessions

## Decision

BitKraft explicitly:

* Does **not** use a Virtual DOM
* Does **not** perform hydration
* Requires deterministic DOM output

Server-rendered HTML must be compatible with client-side updates **without diffing**.

## Consequences

### Positive

* Predictable performance
* Smaller runtime
* No hydration errors

### Negative

* Developers must be careful with DOM assumptions
* Less "magic" than modern frameworks
