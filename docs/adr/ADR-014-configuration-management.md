# **ADR-014: Configuration Management**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Configuration complexity grows with:

* Environment differences (dev, staging, prod)
* Feature flags
* Third-party API keys
* Build-time vs runtime config

Scattered config leads to errors.

## Decision

BitKraft uses **layered configuration**:

* `bitkraft.config.ts` for framework settings
* Environment variables for secrets
* Feature-level config files
* Type-safe config schema validation

## Consequences

### Positive

* Single source of truth
* Type safety prevents errors
* Clear separation of concerns

### Negative

* More files to maintain
* Learning curve for config structure
