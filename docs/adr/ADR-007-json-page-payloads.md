# **ADR-007: JSON Page Payloads Instead of HTML Fragments**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Returning partial HTML fragments:

* Couples server and DOM structure tightly
* Makes client-side composition harder
* Limits caching flexibility

## Decision

For SPA navigation, the server returns **JSON page payloads**:

* Data
* Metadata
* Feature identifiers
* Asset references

The client is responsible for DOM updates.

## Consequences

### Positive

* Clear separation of concerns
* Better caching
* Easier offline support

### Negative

* More client-side logic
* Requires consistent contracts
