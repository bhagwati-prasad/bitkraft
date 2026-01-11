# **ADR-004: Vite as the Official Bundler**

**Status:** Accepted
**Date:** 2026-01-XX

## Context

The framework requires:

* Native ESM support
* Fast development feedback
* Fine-grained code splitting
* Asset manifest generation for SSR

## Decision

Adopt **Vite** as the official build and bundling system.

Vite is used for:

* Development server (HMR)
* Production builds
* Feature-level code splitting
* Manifest generation for asset resolution

## Consequences

### Positive

* Extremely fast dev experience
* Clean ESM-based architecture
* Simple asset resolution via manifest

### Negative

* Requires modern browsers
* Ties build process to Vite ecosystem
