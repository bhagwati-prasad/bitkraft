# **ADR-019: State Management Patterns**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

State management in hybrid apps is challenging:

* Server-rendered initial state
* Client-side state updates
* Feature-local vs global state
* State persistence across navigation

Unmanaged state leads to bugs and memory leaks.

## Decision

BitKraft recommends **decentralized state**:

* Features own their state (no global store mandate)
* SSR initial state via JSON payload
* Optional global store for shared state
* State cleanup enforced by lifecycle

## Consequences

### Positive

* Simplicity for small features
* Flexibility for complex apps
* No framework lock-in

### Negative

* Developers must choose state strategy
* Potential for inconsistent patterns
