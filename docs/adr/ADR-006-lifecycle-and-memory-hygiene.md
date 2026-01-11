# **ADR-006: Explicit Lifecycle & Memory Hygiene**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Long-lived SPA sessions often degrade due to:

* Leaked event listeners
* Orphaned DOM references
* Accumulated JS and CSS assets

## Decision

Every feature **must** implement:

```ts
init(context)
destroy()
```

A central **Lifecycle Manager**:

* Calls `destroy()` on navigation
* Removes feature-specific assets
* Ensures cleanup is enforced

## Consequences

### Positive

* Stable long-running sessions
* Predictable memory usage
* Safer complex applications

### Negative

* Slightly more boilerplate
* Developers must think about teardown
