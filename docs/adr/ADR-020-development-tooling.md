# **ADR-020: Development Tooling & Developer Experience**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Developer productivity depends on:

* Fast feedback loops
* Clear error messages
* Good documentation
* Debugging tools

Poor DX slows development and increases bugs.

## Decision

BitKraft prioritizes **developer experience**:

* HMR (Hot Module Replacement) via Vite
* Detailed error messages with suggestions
* TypeScript-first with strong types
* DevTools browser extension for debugging
* CLI for scaffolding and common tasks

## Consequences

### Positive

* High developer productivity
* Lower learning curve
* Faster onboarding

### Negative

* Tooling maintenance overhead
* Requires modern development environment
