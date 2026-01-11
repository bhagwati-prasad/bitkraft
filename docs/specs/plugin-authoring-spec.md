Below is a **formal, framework-level Plugin Authoring Specification** for **BitKraft Framework**.
This document is written to be **normative**, **implementation-independent**, and suitable for:

* Core maintainers
* Plugin authors
* Security reviewers
* Open-source contributors

You can store this as:

```
docs/specs/plugin-authoring-spec.md
```

---

# **BitKraft Framework**

## **Plugin Authoring Specification (v1.0)**

---

## 1. Purpose of This Specification

This document defines **how plugins are authored, registered, executed, and constrained** within the BitKraft Framework.

It ensures that plugins:

* Extend BitKraft without destabilizing it
* Respect lifecycle, rendering, and navigation discipline
* Remain observable, debuggable, and secure
* Do not violate existing ADRs

This spec is **framework-level** and **application-agnostic**.

---

## 2. Plugin Philosophy

BitKraft plugins exist to **extend behavior**, not to **override architecture**.

### Plugins MAY:

* Observe framework events
* Add side effects (logging, metrics, analytics)
* Integrate external services
* Extend storage or cache backends

### Plugins MUST NOT:

* Override rendering decisions
* Hijack routing
* Bypass lifecycle cleanup
* Mutate framework internals
* Introduce hidden global state

> **Plugins are guests, not owners.**

---

## 3. Plugin Types

BitKraft supports **two plugin categories**:

### 3.1 Backend Plugins

Run in the Node.js environment.

Examples:

* Observability
* Tracing
* Cache adapters
* Security auditing
* Auth integration (via domain logic)

### 3.2 Frontend Plugins

Run in the browser runtime.

Examples:

* Analytics
* Error tracking
* Performance monitoring
* Feature flags
* Session telemetry

Plugins are **explicitly scoped** to backend or frontend.

---

## 4. Plugin Lifecycle

### 4.1 Lifecycle Phases

Every plugin participates in a controlled lifecycle:

1. **Registration**
2. **Setup**
3. **Active Execution**
4. **Teardown**

Lifecycle hooks are **synchronous by default**, async allowed only where explicitly documented.

---

## 5. Plugin Interface (Normative)

### 5.1 Base Plugin Contract

```ts
export interface BitKraftPlugin {
  name: string
  version: string

  setup(context: PluginContext): void | Promise<void>
  teardown?(context: PluginContext): void | Promise<void>
}
```

### 5.2 Required Fields

| Field      | Description                  |
| ---------- | ---------------------------- |
| `name`     | Unique plugin identifier     |
| `version`  | Plugin version (semver)      |
| `setup`    | Called during framework boot |
| `teardown` | Optional cleanup hook        |

---

## 6. Plugin Context

Plugins receive a **read-only context** object.

### 6.1 Context Guarantees

* No direct access to core internals
* No mutation of framework state
* Explicit capabilities only

### 6.2 Example Context (Conceptual)

```ts
PluginContext {
  env: 'development' | 'production'
  hooks: HookRegistry
  logger: Logger
  config: ReadonlyConfig
}
```

---

## 7. Hook System

Plugins interact with BitKraft via **hooks**.

### 7.1 Hook Categories

#### Backend Hooks

* `onRequestStart`
* `onRequestEnd`
* `onSSRRenderStart`
* `onSSRRenderEnd`
* `onCacheHit`
* `onCacheMiss`
* `onError`

#### Frontend Hooks

* `onNavigationStart`
* `onNavigationEnd`
* `onFeatureInit`
* `onFeatureDestroy`
* `onClientError`

---

### 7.2 Hook Registration

```ts
context.hooks.on('onNavigationEnd', (event) => {
  // observe navigation
})
```

Hooks are **non-blocking by default**.

---

## 8. Execution Rules

### 8.1 Ordering

* Core framework hooks run first
* Plugins execute in **registration order**
* Failures in one plugin do not halt others

### 8.2 Isolation

* Plugin errors are sandboxed
* Plugin failures are logged, not propagated
* Plugins cannot crash the framework

---

## 9. Plugin Capabilities & Permissions

Plugins declare **explicit capabilities**.

### 9.1 Capability Declaration

```ts
capabilities: {
  observeNavigation: true,
  observeSSR: true,
  accessStorage: false
}
```

Capabilities are:

* Validated at registration
* Enforced by the framework
* Auditable for security reviews

---

## 10. Plugin Registration

### 10.1 Backend Registration

```ts
registerPlugins([
  analyticsPlugin,
  metricsPlugin
])
```

### 10.2 Frontend Registration

```ts
registerClientPlugins([
  analyticsPlugin
])
```

Plugins must be registered **explicitly** — no auto-discovery.

---

## 11. Interaction with Lifecycle Discipline

Plugins:

* May observe lifecycle events
* Must not prevent cleanup
* Must release resources during teardown

Violating lifecycle rules is grounds for plugin rejection.

---

## 12. Error Handling Rules

### 12.1 Plugin Errors

* Must be caught internally
* Are reported via `onError` hook
* Do not bubble into core logic

### 12.2 Fatal Errors

Only the framework may declare fatal errors.

---

## 13. Performance Constraints

Plugins must:

* Avoid synchronous blocking work
* Avoid large memory retention
* Avoid DOM mutation (frontend plugins)

Performance budgets may be enforced in future versions.

---

## 14. Security Constraints

### 14.1 Trust Levels

* Core Framework: Trusted
* Plugins: Semi-trusted
* Features: Untrusted
* Client Input: Untrusted

### 14.2 Prohibited Actions

* Direct DOM rewriting
* Overriding router behavior
* Modifying cache keys
* Injecting scripts/styles

---

## 15. Version Compatibility

Plugins must declare:

* Supported BitKraft version range
* Compatibility is checked at startup

```ts
compatibility: {
  bitkraft: '^1.0.0'
}
```

---

## 16. Plugin Packaging & Distribution

Plugins:

* Are standard npm packages
* Use ESM format
* Have no required build tooling

Recommended naming:

```
@bitkraft/plugin-<name>
```

---

## 17. Plugin Testing Guidelines

Plugin authors should provide:

* Unit tests for hooks
* Mocked framework context
* Memory usage tests (recommended)

---

## 18. Compliance Checklist (Mandatory)

Before publishing a plugin:

* [ ] Uses only declared hooks
* [ ] Cleans up resources
* [ ] Handles errors internally
* [ ] Does not mutate framework state
* [ ] Declares capabilities
* [ ] Declares version compatibility

---

## 19. Non-Goals

This spec intentionally excludes:

* UI component plugins
* Theme systems
* Code transformation plugins
* Build-time Vite plugins

---

## 20. Summary

The BitKraft plugin system is:

* **Explicit**
* **Lifecycle-aware**
* **Capability-scoped**
* **Safe by default**

Plugins exist to **extend**, not **control**, the framework.

---
