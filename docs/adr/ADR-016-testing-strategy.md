# **ADR-016: Test-Driven Development Strategy**

**Status:** Accepted
**Date:** 2026-01-XX
**Updated:** 2026-01-11 (TDD mandate added)

## Context

Framework testing must cover:

* Unit tests for utilities and logic
* Integration tests for features
* E2E tests for critical user flows
* SSR and SPA mode compatibility

Testing complexity increases with hybrid rendering.

**Critical Addition:** BitKraft's lifecycle-based architecture and hybrid rendering model require **test-driven development** to prevent:
- Memory leaks from improper cleanup
- Regressions in SSR/SPA mode switching
- Lifecycle violations
- Performance degradation

## Decision

BitKraft **mandates test-driven development (TDD)** with **multi-layer testing**:

### TDD Requirement

**All new code MUST follow TDD:**

1. **Write test first** (Red) - Test fails
2. **Implement code** (Green) - Test passes
3. **Refactor** - Improve while tests pass

**Exceptions:** None for core framework. Prototypes may skip TDD but must add tests before merge.

### Testing Tools

* **Vitest** for unit and integration tests (fast, ESM-native)
* **Playwright** for E2E tests (cross-browser)
* **Testing Library** for DOM testing utilities
* **CI/CD integration** for automated testing

### Coverage Requirements

**Mandatory minimums:**
- Core framework: >80% line coverage
- Server modules: >75% line coverage
- Client runtime: >80% line coverage
- Features: >70% line coverage

## Consequences

### Positive

* **High confidence in releases** - TDD catches issues early
* **Catches regressions early** - Automated test suite prevents breaks
* **Documents expected behavior** - Tests serve as living documentation
* **Testable by design** - TDD forces better architecture
* **Memory safety** - Lifecycle tests prevent leaks
* **Faster debugging** - Failing tests pinpoint issues

### Negative

* **Initial slower development** - Writing tests first takes time
* **Test maintenance overhead** - Tests must be updated with code
* **Slower CI/CD pipelines** - More tests = longer runs
* **Learning curve** - Developers must adopt TDD mindset

### Mitigations

* Fast test execution (Vitest runs in <5s for unit tests)
* Parallel testing in CI
* Clear examples and test templates
* Automated coverage reports
* TDD training and documentation
