# **ADR-017: Internationalization (i18n) Support**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Global applications require:

* Multi-language support
* RTL/LTR text direction
* Locale-specific formatting (dates, numbers)
* SEO-friendly language switching

Hard-coded text limits market reach.

## Decision

BitKraft provides **i18n infrastructure**:

* Route-based locale detection (`/en/`, `/fr/`)
* Server and client translation loading
* SSR-safe locale context
* Plugin-based translator integration

## Consequences

### Positive

* Global market readiness
* SEO-friendly multi-language sites
* Flexible translator choice

### Negative

* Additional routing complexity
* Translation management required
* Potential performance impact
