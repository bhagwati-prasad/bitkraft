# **ADR-012: SSR Streaming for Progressive Rendering**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

Traditional SSR sends HTML only after full page render:

* Delays time-to-first-byte (TTFB)
* Blocks on slow data fetches
* Poor perceived performance

Modern browsers support streaming HTML.

## Decision

BitKraft supports **streaming SSR** by default:

* HTML shell sent immediately
* Features stream as data resolves
* Inline scripts handle late-arriving content
* Fallback to buffered mode for incompatible clients

## Consequences

### Positive

* Faster perceived load times
* Better handling of slow APIs
* Progressive enhancement

### Negative

* More complex rendering logic
* Requires careful error handling in streams
* Not all CDNs support streaming
