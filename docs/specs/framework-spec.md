Below is a **formal, application-agnostic specification** for the project, written as a **v1.0 framework spec**.
This is suitable for **internal engineering**, **open-source release**, or **productization**.

---

# **BitKraft Framework**

## **Technical Specification (v1.0)**

---

## 1. Document Purpose

This document defines the **technical specification** for the **BitKraft Framework**, a hybrid SSR–SPA web framework built on Node.js and Vite.

It specifies:

* Architectural principles
* Core modules and their responsibilities
* Request & rendering lifecycle
* Frontend runtime behavior
* Build & bundling strategy
* Extension and feature development rules

This document is **application-agnostic** and does **not** assume any specific domain (e.g., learning platform, SaaS, CMS).

---

## 2. Project Definition

### 2.1 Name

**BitKraft Framework**

### 2.2 Category

Hybrid Web Application Framework (SSR + SPA)

### 2.3 Target Runtime

* **Backend:** Node.js (≥ 18)
* **Frontend:** Modern browsers (ESM support)
* **Build System:** Vite

---

## 3. Design Goals

### 3.1 Primary Goals

1. **100% SEO compliance**
2. **Instant SPA navigation**
3. **No hydration mismatches**
4. **Strict memory lifecycle control**
5. **Deterministic rendering**
6. **Native Web Standards only**

### 3.2 Non-Goals

* Virtual DOM
* JSX-based frameworks
* Implicit state magic
* Client-side hydration
* Opinionated UI layer

---

## 4. Core Architectural Principles

### 4.1 Hybrid Rendering Model

BitKraft operates in **two modes**:

* **SSR Mode** → Full HTML document
* **SPA Mode** → JSON page payload

The decision is made centrally by the **Content Negotiator**.

### 4.2 Deterministic Rendering

* Server-rendered HTML and SPA-rendered DOM **must be structurally identical**
* No reconciliation or hydration logic exists

### 4.3 Lifecycle Discipline

Every page and feature must define:

* `init()` (on entry)
* `destroy()` (on exit)

Memory cleanup is **mandatory**, not optional.

---

## 5. High-Level System Architecture

```
Client (Browser)
 ├── SPA Router
 ├── Lifecycle Manager
 ├── Storage Adapter
 ├── Scroll Manager
 └── Feature Modules
        ↓
Backend (Node.js)
 ├── Content Negotiator
 ├── Route Registry
 ├── Cache Manager
 ├── SSR Render Engine
 ├── Vite Asset Resolver
 └── Domain Modules
```

---

## 6. Backend Architecture Specification

### 6.1 Backend Responsibilities

* Request classification (SSR vs SPA)
* Route resolution
* HTML rendering
* JSON payload generation
* Cache coordination
* Asset resolution via Vite

---

### 6.2 Backend Directory Structure (Normative)

```
backend/
├── core/
│   ├── negotiator/
│   ├── router/
│   ├── cache/
│   ├── render/
│   ├── vite/
│   ├── lifecycle/
│   └── contracts/
├── modules/
├── api/
├── app.ts
├── server.ts
└── config/
```

---

## 7. Backend Core Modules (Normative)

---

### 7.1 Content Negotiator

**Responsibility**

* Inspect every incoming HTTP request
* Decide response type:

  * `HTML_DOCUMENT`
  * `JSON_PAYLOAD`

**Decision Inputs**

* Request headers
* Navigation marker headers
* User-Agent (crawler detection)
* Forced refresh flags

**Hard Rule**

> Controllers MUST NOT determine render mode.

---

### 7.2 Route Registry

Routes are declared as **data structures**.

#### Route Definition

```ts
RouteConfig {
  path: string
  controller: Controller
  template?: string
  entry?: string
  cache?: CachePolicy
}
```

**Responsibilities**

* URL matching
* Controller binding
* Template association
* Feature entry resolution
* Cache policy declaration

---

### 7.3 Cache Manager

**Cache Scope**

* Rendered HTML
* JSON page payloads
* Derived domain data

**Supported Policies**

* TTL-based
* Tag-based invalidation
* Manual purge

**Storage Backends**

* In-memory (required)
* Redis / external (optional)

---

### 7.4 Render Engine (SSR)

**Responsibilities**

* Render full HTML documents
* Inject resolved assets
* Embed initial page context

**Constraints**

* Output MUST be SPA-compatible
* No hydration markers
* No client-only assumptions

---

### 7.5 Vite Asset Resolver

**Purpose**
Map logical feature entries to physical assets.

```ts
resolveAssets(entry: string): {
  js: string[]
  css: string[]
}
```

**Modes**

* Dev: Vite dev server
* Prod: `manifest.json`

---

## 8. Frontend Runtime Specification

### 8.1 Frontend Responsibilities

* Navigation control
* Feature loading
* Memory cleanup
* Local persistence
* UX continuity

---

### 8.2 Frontend Directory Structure (Normative)

```
frontend/
├── runtime/
│   ├── router/
│   ├── lifecycle/
│   ├── storage/
│   ├── scroll/
│   └── vite/
├── features/
├── global/
├── bootstrap.js
└── vite.config.js
```

---

## 9. Frontend Runtime Modules

---

### 9.1 SPA Router

**Responsibilities**

* Intercept internal navigation
* Manage History API
* Fetch JSON payloads
* Coordinate lifecycle transitions

**Hard Rule**

> All navigation MUST pass through the SPA Router.

---

### 9.2 Lifecycle & Cleanup Manager

**On Page Exit**

* Remove event listeners
* Destroy feature instances
* Remove feature CSS
* Release memory references

**On Page Entry**

* Inject feature assets
* Initialize feature logic

---

### 9.3 Storage Adapter

Unified abstraction over:

* IndexedDB (default)
* localStorage (fallback)
* In-memory cache

**API**

```ts
get(key)
set(key, value, ttl)
invalidate(tag)
```

---

### 9.4 Scroll Manager

**Responsibilities**

* Save scroll position per route
* Restore on history navigation
* Integrate with lifecycle hooks

---

## 10. Feature Module Specification

### 10.1 Feature Definition

A **feature** is the smallest deployable unit of UI + logic.

```
features/<feature-name>/
├── feature.page.js
├── feature.ui.js
├── feature.state.js
├── feature.service.js
├── feature.css
└── feature.contract.ts
```

### 10.2 Feature Lifecycle Contract

```ts
export function init(context) {}
export function destroy() {}
```

Both functions are **mandatory**.

---

## 11. Build System Specification (Vite)

### 11.1 Build Outputs

* ESM bundles
* CSS chunks
* `manifest.json`

### 11.2 Entry Strategy

* One global runtime entry
* One entry per feature

### 11.3 Asset Types

| Type     | Strategy             |
| -------- | -------------------- |
| Runtime  | Loaded once          |
| Features | Lazy-loaded          |
| CSS      | Injected per feature |

---

## 12. Development vs Production Modes

### Development

* Vite dev server
* HMR enabled
* No asset manifest
* Backend proxies assets

### Production

* Prebuilt assets
* Manifest-driven resolution
* CDN-compatible output

---

## 13. Request Lifecycle (Normative)

### First Visit / Bot

```
HTTP Request
 → Content Negotiator
 → Route Registry
 → Cache (HTML)
 → Render Engine
 → HTML Response
```

---

### SPA Navigation

```
User Click
 → SPA Router
 → Storage Check
 → Fetch JSON
 → Lifecycle Cleanup
 → Feature Load (import)
 → DOM Update
```

---

## 14. Security & Stability Guarantees

* Deterministic rendering
* No hidden runtime state
* Memory cleanup enforced
* No long-lived global listeners
* No implicit side effects

---

## 15. Extensibility Model

BitKraft supports:

* New features
* New cache backends
* New render engines
* New storage adapters

Without modifying core runtime behavior.

---

## 16. Compliance Rules (Hard Constraints)

1. Controllers do not render
2. Router owns navigation
3. Lifecycle cleanup is mandatory
4. Assets are feature-scoped
5. No hydration logic
6. No Virtual DOM

---

## 17. Versioning & Evolution

* Semantic versioning
* Breaking changes require spec update
* Feature APIs are versioned

---

## 18. Summary

**BitKraft Framework** is a:

* Rendering framework
* Navigation framework
* Lifecycle framework

It intentionally avoids UI abstractions and instead enforces **discipline, predictability, and performance**.

Any application built on BitKraft is simply:

> **A collection of feature modules orchestrated by the framework**

---
