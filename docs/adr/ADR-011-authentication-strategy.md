# **ADR-011: Authentication & Authorization Strategy**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Authentication needs vary widely:

* Session-based auth
* Token-based (JWT)
* OAuth/OIDC
* Custom enterprise systems

Forcing a single approach limits framework adoption.

## Decision

BitKraft provides **auth primitives, not implementations**:

* Standard middleware hooks for auth checks
* Context injection for user identity
* Support for both cookie and header-based auth
* No built-in auth provider (plugin territory)

## Consequences

### Positive

* Maximum flexibility
* No vendor lock-in
* Works with any auth system

### Negative

* More setup required
* Developers must choose auth strategy
* No "batteries included" solution
