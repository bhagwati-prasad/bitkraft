# **ADR-010: Plugin System Architecture**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

A framework must balance:

* Core functionality staying minimal and stable
* Extensibility for diverse use cases
* Avoiding "framework bloat"

Hard-coding every feature leads to maintenance burden and prevents community contribution.

## Decision

BitKraft provides a **lightweight plugin system**:

* Plugins register via a standard interface
* Hooks are provided at key lifecycle points (init, route, render, destroy)
* Plugins can extend features, add middleware, or inject assets
* Core remains minimal; complexity lives in plugins

## Consequences

### Positive

* Extensible without forking
* Community can contribute specialized features
* Core stays focused and maintainable

### Negative

* Plugin quality varies
* Requires plugin API versioning
* Potential for plugin conflicts
