Below is a **formal Plugin API Reference** for **BitKraft Framework v1.0**.
This is a **developer-facing reference**, complementary to the **Plugin Authoring Specification**, and written in a style suitable for official docs.

You can store this as:

```
docs/api/plugin-api-reference.md
```

---

# **BitKraft Framework**

## **Plugin API Reference (v1.0)**

---

## 1. Overview

This document defines the **public Plugin API** exposed by the BitKraft Framework.

It specifies:

* Plugin interfaces
* Lifecycle hooks
* Context objects
* Hook events and payloads
* Capability system
* Error and performance guarantees

This reference is **normative**: plugin authors must rely only on APIs defined here.

---

## 2. Plugin Types

BitKraft supports two plugin execution environments:

| Type                | Runtime | Scope                           |
| ------------------- | ------- | ------------------------------- |
| **Backend Plugin**  | Node.js | Requests, SSR, caching          |
| **Frontend Plugin** | Browser | Navigation, features, telemetry |

Plugins **must declare** which environment they target.

---

## 3. Core Plugin Interface

### 3.1 `BitKraftPlugin`

```ts
export interface BitKraftPlugin {
  name: string
  version: string

  compatibility?: {
    bitkraft: string
  }

  capabilities?: PluginCapabilities

  setup(context: PluginContext): void | Promise<void>
  teardown?(context: PluginContext): void | Promise<void>
}
```

---

### 3.2 Field Reference

| Field           | Required | Description                      |
| --------------- | -------- | -------------------------------- |
| `name`          | ✅        | Unique plugin identifier         |
| `version`       | ✅        | Plugin version (semver)          |
| `compatibility` | ❌        | Supported BitKraft version range |
| `capabilities`  | ❌        | Explicit permission declaration  |
| `setup`         | ✅        | Called during framework boot     |
| `teardown`      | ❌        | Called during framework shutdown |

---

## 4. Plugin Context

Plugins receive a **read-only context object** during lifecycle hooks.

### 4.1 `PluginContext`

```ts
export interface PluginContext {
  env: 'development' | 'production'
  logger: PluginLogger
  hooks: HookRegistry
  config: Readonly<Record<string, unknown>>
}
```

---

### 4.2 Context Properties

#### `env`

* Indicates current runtime environment
* Must not be mutated

#### `logger`

Scoped logger for the plugin.

```ts
logger.info(message, meta?)
logger.warn(message, meta?)
logger.error(message, meta?)
```

Logs are automatically namespaced by plugin name.

---

#### `hooks`

Used to subscribe to framework events.

```ts
context.hooks.on(eventName, handler)
```

Handlers **must not throw**.

---

#### `config`

Read-only configuration object scoped to the plugin.

---

## 5. Hook Registry

### 5.1 Hook Registration

```ts
context.hooks.on(event, callback)
```

* Hooks are **fire-and-forget**
* Errors are caught by the framework
* Hooks cannot block core execution

---

### 5.2 Backend Hooks

| Hook               | Payload                  | Description          |
| ------------------ | ------------------------ | -------------------- |
| `onRequestStart`   | `{ req, id }`            | Incoming request     |
| `onRequestEnd`     | `{ req, res, duration }` | Request completed    |
| `onSSRRenderStart` | `{ route }`              | SSR rendering begins |
| `onSSRRenderEnd`   | `{ route, htmlSize }`    | SSR completed        |
| `onCacheHit`       | `{ key, type }`          | Cache hit            |
| `onCacheMiss`      | `{ key, type }`          | Cache miss           |
| `onError`          | `{ error, phase }`       | Server-side error    |

---

### 5.3 Frontend Hooks

| Hook                | Payload                  | Description              |
| ------------------- | ------------------------ | ------------------------ |
| `onNavigationStart` | `{ from, to }`           | SPA navigation begins    |
| `onNavigationEnd`   | `{ from, to, duration }` | SPA navigation completed |
| `onFeatureInit`     | `{ feature }`            | Feature initialized      |
| `onFeatureDestroy`  | `{ feature }`            | Feature destroyed        |
| `onClientError`     | `{ error, source }`      | Client-side error        |

---

## 6. Capabilities API

### 6.1 Capability Declaration

Plugins declare required capabilities:

```ts
capabilities: {
  observeNavigation: true,
  observeSSR: true,
  accessStorage: false
}
```

---

### 6.2 Supported Capabilities

| Capability          | Description                     |
| ------------------- | ------------------------------- |
| `observeNavigation` | Listen to SPA navigation events |
| `observeSSR`        | Listen to SSR lifecycle events  |
| `observeCache`      | Observe cache hits/misses       |
| `observeErrors`     | Receive error events            |
| `accessStorage`     | Read/write via storage adapter  |
| `accessConfig`      | Read plugin config              |

Undeclared capabilities are **denied by default**.

---

## 7. Error Handling Contract

### 7.1 Plugin Errors

* Plugin errors are caught internally
* Reported via `onError` hook
* Never propagate to framework core

### 7.2 Prohibited Behavior

Plugins **must not**:

* Throw uncaught exceptions
* Modify request/response objects
* Interrupt lifecycle execution

---

## 8. Performance Constraints

Plugins must:

* Avoid synchronous blocking work
* Avoid long-lived references
* Avoid DOM mutation (frontend plugins)

The framework may:

* Warn on slow hooks
* Disable misbehaving plugins (future)

---

## 9. Plugin Registration API

### 9.1 Backend Registration

```ts
import { registerPlugins } from 'bitkraft/plugins'

registerPlugins([
  metricsPlugin,
  tracingPlugin
])
```

---

### 9.2 Frontend Registration

```ts
import { registerClientPlugins } from 'bitkraft/runtime'

registerClientPlugins([
  analyticsPlugin
])
```

Registration order determines hook execution order.

---

## 10. Teardown Semantics

### 10.1 Teardown Triggers

* Server shutdown
* Hot reload (dev mode)
* Explicit plugin removal

### 10.2 Teardown Responsibilities

Plugins must:

* Remove timers
* Close connections
* Release memory

---

## 11. Version Compatibility

Plugins should declare:

```ts
compatibility: {
  bitkraft: '^1.0.0'
}
```

Incompatible plugins:

* Are skipped
* Emit a warning
* Do not crash startup

---

## 12. Packaging Requirements

* ESM-only
* No side effects at import time
* No reliance on undocumented APIs

Recommended naming:

```
@bitkraft/plugin-<name>
```

---

## 13. Example Plugin (Minimal)

```ts
export const analyticsPlugin = {
  name: 'analytics',
  version: '1.0.0',

  capabilities: {
    observeNavigation: true
  },

  setup({ hooks, logger }) {
    hooks.on('onNavigationEnd', ({ to, duration }) => {
      logger.info('Navigation', { to, duration })
    })
  }
}
```

---

## 14. API Stability Guarantees

* Plugin API follows semantic versioning
* Breaking changes require:

  * Major version bump
  * Migration notes
  * Deprecation period

---

## 15. Summary

The BitKraft Plugin API is:

* Explicit
* Minimal
* Safe
* Lifecycle-aware

Plugins **extend behavior** but never **control the framework**.

---