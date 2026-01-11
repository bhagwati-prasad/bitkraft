# **ADR-015: Logging & Observability**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Production debugging requires:

* Structured logging
* Performance metrics
* Request tracing
* Error aggregation

Console.log is insufficient at scale.

## Decision

BitKraft provides **observability primitives**:

* Structured logger with levels (debug, info, warn, error)
* Built-in request ID tracking
* Performance marks for SSR and SPA metrics
* Hooks for external observability tools (OpenTelemetry, etc.)

## Consequences

### Positive

* Production-ready logging
* Easy integration with monitoring tools
* Performance visibility

### Negative

* Overhead in development
* Requires log management strategy
