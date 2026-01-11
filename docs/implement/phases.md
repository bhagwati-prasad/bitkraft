Below is a **phase-by-phase, exhaustive implementation plan** for the **BitKraft Framework**, designed so that **no part of the framework is left out** and each phase produces a **working, testable system**.

This plan is written as if you were **building BitKraft as a real framework product**, not a demo.

Each phase has:

* **Goal**
* **Modules to build**
* **Implementation details**
* **Acceptance criteria (exit conditions)**

---

# **BitKraft Framework – Phase-by-Phase Implementation Plan**

---

## **PHASE 0 — Foundation & Governance**

> *Establish non-negotiables before writing framework code*

### Goal

Define the framework’s boundaries, rules, and development discipline.

### Tasks

* Finalize **BitKraft Spec v1.0**
* Define:

  * Coding standards
  * Folder conventions
  * Naming rules
* Decide:

  * Node version (≥18)
  * Package manager
  * Monorepo strategy
* Create:

  * ADR template
  * RFC template

### Deliverables

* `SPEC.md` in /docs/specs/
* `ARCH.md` in /docs/
* `ADR-0001-framework-scope.md` in /docs/adr/

### Exit Criteria

✅ Spec approved
✅ All future work references this spec

---

## **PHASE 1 — Minimal Runtime Kernel**

> *The smallest possible BitKraft that works*

### Goal

Implement the **kernel**: SSR ↔ SPA switching + lifecycle.

### Modules

**Backend**

* Express server
* Content Negotiator
* Route Registry (static)
* SSR Renderer (EJS)

**Frontend**

* SPA Router
* Lifecycle Manager
* Feature init/destroy contract

### Tasks

* Implement request classification
* Hardcode 1–2 routes
* Implement JSON page payload
* Implement SPA navigation
* Enforce lifecycle cleanup

### Deliverables

* Working SSR first load
* SPA navigation without reload
* Feature `init()` and `destroy()` executed correctly

### Exit Criteria

✅ Page loads via SSR
✅ Navigation via SPA
✅ No memory leakage on navigation

---

## **PHASE 2 — Vite Integration (Build & Dev)**

> *Introduce real bundling without breaking kernel*

### Goal

Integrate **Vite as the official bundler**.

### Modules

* Vite dev server
* Vite production build
* Asset manifest generation
* Backend asset resolver

### Tasks

* Create Vite config
* Define:

  * Global runtime entry
  * Feature entry points
* Implement backend asset resolution:

  * Dev mode → Vite server
  * Prod mode → manifest.json
* Inject assets into SSR HTML

### Deliverables

* Vite-powered dev environment
* Manifest-driven production builds

### Exit Criteria

✅ No hardcoded asset paths
✅ SSR uses Vite assets
✅ SPA loads features via dynamic imports

---

## **PHASE 3 — Route Registry v1 (Declarative Routing)**

> *Make routing data-driven*

### Goal

Replace ad-hoc routing with a **declarative route registry**.

### Modules

* Route config schema
* Route matcher
* Entry-to-feature mapping

### Tasks

* Define `RouteConfig`
* Support:

  * Path params
  * Feature entry mapping
  * Cache hints
* Integrate registry with:

  * SSR rendering
  * SPA payloads

### Deliverables

* Centralized route registry
* Zero routing logic in controllers

### Exit Criteria

✅ All routes declared as data
✅ Controllers unaware of render mode

---

## **PHASE 4 — Cache Manager (Server-Side)**

> *Performance becomes a first-class citizen*

### Goal

Introduce a **unified caching system**.

### Modules

* Cache abstraction
* In-memory store
* TTL invalidation
* Tag-based invalidation

### Tasks

* Cache:

  * HTML responses
  * JSON page payloads
* Implement cache middleware
* Implement manual purge hooks

### Deliverables

* Cached SSR responses
* Cached SPA payloads

### Exit Criteria

✅ Cache hits observable
✅ Tag invalidation works
✅ No stale content bugs

---

## **PHASE 5 — Frontend Storage Adapter**

> *Client-side performance & offline readiness*

### Goal

Persist data on client with controlled expiry.

### Modules

* IndexedDB adapter
* TTL logic
* Fallback to memory/localStorage

### Tasks

* Store JSON page payloads
* Store feature state drafts
* Add cache expiration logic
* Integrate with SPA router

### Deliverables

* Near-instant navigation
* Reduced network requests

### Exit Criteria

✅ Cached pages load without network
✅ Expired data invalidates correctly

---

## **PHASE 6 — Lifecycle & Memory Hygiene Enforcement**

> *Make memory safety non-optional*

### Goal

Enforce **strict lifecycle discipline**.

### Modules

* Lifecycle hooks
* Asset injection & removal
* Event listener tracking

### Tasks

* Track registered listeners
* Remove feature CSS on exit
* Destroy feature instances
* Prevent global leaks

### Deliverables

* Clean heap after navigation
* Predictable memory usage

### Exit Criteria

✅ No accumulating listeners
✅ No orphaned DOM nodes
✅ Long sessions remain stable

---

## **PHASE 7 — Scroll Manager**

> *UX continuity across navigation*

### Goal

Preserve user context during navigation.

### Modules

* Scroll position tracker
* History integration

### Tasks

* Store scroll per route
* Restore on back/forward
* Integrate with lifecycle events

### Deliverables

* Native-feeling navigation

### Exit Criteria

✅ Back button restores scroll
✅ No scroll jumps

---

## **PHASE 8 — Feature System v1**

> *Formalize how features are built*

### Goal

Standardize **feature module structure**.

### Modules

* Feature contract
* Feature loader
* Feature context

### Tasks

* Enforce directory layout
* Enforce lifecycle API
* Provide feature context:

  * Params
  * State
  * Services

### Deliverables

* Predictable feature behavior

### Exit Criteria

✅ Features are isolated
✅ Features can be removed without side effects

---

## **PHASE 9 — Build-Time Metadata & Manifests**

> *Bridge build system and runtime*

### Goal

Export build-time data for runtime use.

### Modules

* Route → asset mapping
* Feature → chunk mapping

### Tasks

* Generate metadata JSON
* Consume metadata in backend
* Validate asset consistency

### Deliverables

* Runtime-aware builds

### Exit Criteria

✅ Backend knows feature assets
✅ No missing chunks in prod

---

## **PHASE 10 — Error Handling & Recovery**

> *Failure should be graceful*

### Goal

Introduce robust error handling.

### Modules

* Server error middleware
* Client error boundary
* Fallback rendering

### Tasks

* Standardize error responses
* Implement error pages
* Add SPA fallback UI

### Deliverables

* Graceful degradation

### Exit Criteria

✅ Errors don’t break navigation
✅ SSR & SPA errors handled consistently

---

## **PHASE 11 — Security Hardening**

> *Make BitKraft safe by default*

### Goal

Apply security best practices.

### Modules

* CSP headers
* Navigation validation
* XSS protection

### Tasks

* Configure Helmet
* Lock down dynamic imports
* Sanitize SSR outputs

### Deliverables

* Secure baseline

### Exit Criteria

✅ CSP enforced
✅ No unsafe eval paths

---

## **PHASE 12 — CLI Tooling**

> *Developer experience matters*

### Goal

Create **BitKraft CLI**.

### Modules

* Project scaffolding
* Feature generator
* Dev server orchestration

### Tasks

* Implement CLI commands
* Wire CLI to Vite & backend
* Add cache purge commands

### Deliverables

* One-command dev workflow

### Exit Criteria

✅ New project in <1 minute
✅ Zero manual setup

---

## **PHASE 13 — Documentation & Examples**

> *Make it usable by others*

### Goal

Document everything.

### Modules

* Docs site
* Examples
* Tutorials

### Tasks

* Write getting started guide
* Add example apps
* Write architecture deep dives

### Deliverables

* Public-ready docs

### Exit Criteria

✅ New dev can build an app
✅ No tribal knowledge

---

## **PHASE 14 — Performance, Profiling & QA**

> *Prove the framework works at scale*

### Goal

Validate performance & stability.

### Tasks

* Measure:

  * TTFB
  * Navigation latency
  * Memory usage
* Stress-test long sessions
* Optimize hot paths

### Deliverables

* Performance report

### Exit Criteria

✅ Meets performance targets
✅ No memory growth over time

---

## **PHASE 15 — Release & Governance**

> *Make BitKraft a real product*

### Goal

Prepare for public or internal release.

### Tasks

* Versioning strategy
* Contribution guidelines
* Issue templates
* Roadmap

### Deliverables

* BitKraft v1.0 release

### Exit Criteria

✅ Stable API
✅ Clear upgrade path

---

# **Final Notes**

This plan ensures:

* No subsystem is skipped
* Each phase builds on previous ones
* You always have a runnable system
* Risk is controlled
