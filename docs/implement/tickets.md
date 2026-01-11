Below is a **Jira-style breakdown of Epics → Stories → Tasks**, mapped **exactly** to the BitKraft Framework phases and Gantt roadmap.

This is written so you can **copy-paste directly into Jira** (or Linear) with minimal editing.

I’ll structure it as:

* **Epic (EPIC-XX)**

  * Story (STORY-XX.Y)

    * Tasks (TASK-XX.Y.Z)

I’ll also include **acceptance criteria** per story (very important for Jira).

---

# 🧱 EPIC-00: Foundation & Governance

### Goal

Establish architectural rules, scope, and development discipline.

---

### STORY-00.1: Define BitKraft Framework Scope & Principles

**Acceptance Criteria**

* Framework goals and non-goals are documented
* Rendering model is explicitly defined

**Tasks**

* TASK-00.1.1 Write BitKraft vision & positioning
* TASK-00.1.2 Define SSR vs SPA rendering rules
* TASK-00.1.3 Document non-goals (no VDOM, no hydration)

---

### STORY-00.2: Create Specification & ADR Templates

**Acceptance Criteria**

* All future decisions reference ADRs
* Spec is versioned

**Tasks**

* TASK-00.2.1 Create SPEC.md
* TASK-00.2.2 Create ADR template
* TASK-00.2.3 Create RFC template

---

# 🚀 EPIC-01: Minimal Runtime Kernel

### Goal

Implement the smallest working BitKraft system.

---

### STORY-01.1: Express Server & Request Pipeline

**Acceptance Criteria**

* Server responds to HTTP requests
* Middleware pipeline is in place

**Tasks**

* TASK-01.1.1 Setup Express server
* TASK-01.1.2 Configure static asset serving
* TASK-01.1.3 Add JSON body parsing

---

### STORY-01.2: Content Negotiator (Gatekeeper)

**Acceptance Criteria**

* SSR vs SPA mode is decided centrally
* Controllers do not detect render mode

**Tasks**

* TASK-01.2.1 Detect SPA navigation headers
* TASK-01.2.2 Detect bots via User-Agent
* TASK-01.2.3 Attach renderMode to request context

---

### STORY-01.3: SSR Renderer (EJS)

**Acceptance Criteria**

* Full HTML is rendered on first load
* HTML is SPA-compatible

**Tasks**

* TASK-01.3.1 Integrate EJS templates
* TASK-01.3.2 Create base layout
* TASK-01.3.3 Render page templates via server

---

### STORY-01.4: Minimal SPA Router

**Acceptance Criteria**

* Internal links do not reload page
* JSON payloads are fetched correctly

**Tasks**

* TASK-01.4.1 Intercept anchor clicks
* TASK-01.4.2 Send SPA navigation headers
* TASK-01.4.3 Replace page DOM content

---

### STORY-01.5: Feature Lifecycle Contract

**Acceptance Criteria**

* Features expose init/destroy
* destroy() is always called on navigation

**Tasks**

* TASK-01.5.1 Define feature lifecycle interface
* TASK-01.5.2 Implement lifecycle registry
* TASK-01.5.3 Call destroy before new init

---

# ⚡ EPIC-02: Vite Integration

### Goal

Use Vite as the official bundler.

---

### STORY-02.1: Vite Dev Environment

**Acceptance Criteria**

* Vite dev server runs
* HMR works for frontend code

**Tasks**

* TASK-02.1.1 Create Vite config
* TASK-02.1.2 Setup frontend entry points
* TASK-02.1.3 Proxy assets via backend

---

### STORY-02.2: Production Build & Manifest

**Acceptance Criteria**

* Assets are hashed
* manifest.json is generated

**Tasks**

* TASK-02.2.1 Enable Vite manifest
* TASK-02.2.2 Configure build output paths
* TASK-02.2.3 Validate chunk generation

---

### STORY-02.3: Backend Asset Resolver

**Acceptance Criteria**

* SSR injects correct JS/CSS
* No hardcoded asset paths

**Tasks**

* TASK-02.3.1 Parse Vite manifest
* TASK-02.3.2 Resolve feature entry assets
* TASK-02.3.3 Handle dev vs prod modes

---

# 🗺️ EPIC-03: Route Registry (Declarative Routing)

### Goal

Make routing data-driven.

---

### STORY-03.1: Route Config Schema

**Acceptance Criteria**

* Routes defined as data
* Supports params and feature entry

**Tasks**

* TASK-03.1.1 Define RouteConfig interface
* TASK-03.1.2 Add cache metadata support
* TASK-03.1.3 Validate route definitions

---

### STORY-03.2: Route Matching Engine

**Acceptance Criteria**

* URLs resolve correctly
* Params are passed to controllers

**Tasks**

* TASK-03.2.1 Implement path matcher
* TASK-03.2.2 Extract route params
* TASK-03.2.3 Bind controller execution

---

# 🧠 EPIC-04: Server Cache Manager

### Goal

Improve SSR and SPA performance.

---

### STORY-04.1: Cache Abstraction Layer

**Acceptance Criteria**

* Cache API is unified
* Storage backend is pluggable

**Tasks**

* TASK-04.1.1 Define cache interface
* TASK-04.1.2 Implement in-memory store
* TASK-04.1.3 Add TTL support

---

### STORY-04.2: Tag-Based Invalidation

**Acceptance Criteria**

* Cache entries can be purged by tag

**Tasks**

* TASK-04.2.1 Implement tag indexing
* TASK-04.2.2 Add manual purge API
* TASK-04.2.3 Add admin hooks

---

# 💾 EPIC-05: Client Storage Adapter

### Goal

Persist data client-side.

---

### STORY-05.1: IndexedDB Adapter

**Acceptance Criteria**

* JSON payloads persist
* TTL expiration works

**Tasks**

* TASK-05.1.1 Setup IndexedDB schema
* TASK-05.1.2 Implement CRUD API
* TASK-05.1.3 Add expiration logic

---

### STORY-05.2: Storage Fallbacks

**Acceptance Criteria**

* Works without IndexedDB
* Graceful degradation

**Tasks**

* TASK-05.2.1 Add in-memory fallback
* TASK-05.2.2 Add localStorage fallback

---

# 🧹 EPIC-06: Lifecycle & Memory Hygiene

### Goal

Prevent memory leaks.

---

### STORY-06.1: Event Listener Tracking

**Acceptance Criteria**

* All listeners are removable

**Tasks**

* TASK-06.1.1 Wrap addEventListener
* TASK-06.1.2 Track listener references
* TASK-06.1.3 Remove on destroy

---

### STORY-06.2: Asset Injection & Removal

**Acceptance Criteria**

* Feature CSS/JS removed on exit

**Tasks**

* TASK-06.2.1 Track injected assets
* TASK-06.2.2 Remove CSS on destroy
* TASK-06.2.3 Validate heap stability

---

# 📜 EPIC-07: Scroll Manager

### STORY-07.1: Scroll Persistence

**Acceptance Criteria**

* Back/forward restores scroll

**Tasks**

* TASK-07.1.1 Track scroll per route
* TASK-07.1.2 Restore on navigation
* TASK-07.1.3 Integrate with lifecycle

---

# 🧩 EPIC-08: Feature System v1

### STORY-08.1: Feature Module Standard

**Acceptance Criteria**

* Feature structure enforced

**Tasks**

* TASK-08.1.1 Define feature folder schema
* TASK-08.1.2 Validate lifecycle exports

---

### STORY-08.2: Feature Context Injection

**Acceptance Criteria**

* Features receive params & services

**Tasks**

* TASK-08.2.1 Define feature context
* TASK-08.2.2 Inject route params
* TASK-08.2.3 Inject shared services

---

# 🏗️ EPIC-09: Build-Time Metadata

### STORY-09.1: Metadata Generation

**Acceptance Criteria**

* Route → asset mapping exists

**Tasks**

* TASK-09.1.1 Export build metadata
* TASK-09.1.2 Validate against manifest

---

# ❌ EPIC-10: Error Handling & Recovery

### STORY-10.1: Server Error Handling

**Acceptance Criteria**

* SSR errors render fallback pages

**Tasks**

* TASK-10.1.1 Global error middleware
* TASK-10.1.2 Error page templates

---

### STORY-10.2: SPA Error Recovery

**Acceptance Criteria**

* SPA navigation recovers from failures

**Tasks**

* TASK-10.2.1 Client error boundary
* TASK-10.2.2 Retry / fallback UI

---

# 🔐 EPIC-11: Security Hardening

### STORY-11.1: Security Headers

**Acceptance Criteria**

* CSP enforced
* XSS mitigated

**Tasks**

* TASK-11.1.1 Configure Helmet
* TASK-11.1.2 Define CSP rules

---

# 🛠️ EPIC-12: BitKraft CLI

### STORY-12.1: CLI Scaffolding

**Acceptance Criteria**

* New project created via CLI

**Tasks**

* TASK-12.1.1 Setup CLI entry
* TASK-12.1.2 Generate base project

---

### STORY-12.2: Feature Generator

**Acceptance Criteria**

* Feature skeleton generated

**Tasks**

* TASK-12.2.1 Implement feature templates
* TASK-12.2.2 Wire into CLI

---

# 📚 EPIC-13: Documentation & Examples

### STORY-13.1: Developer Docs

**Acceptance Criteria**

* New dev can build an app

**Tasks**

* TASK-13.1.1 Getting started guide
* TASK-13.1.2 Architecture docs

---

# 🚦 EPIC-14: Performance & QA

### STORY-14.1: Performance Benchmarks

**Acceptance Criteria**

* Performance targets met

**Tasks**

* TASK-14.1.1 Measure TTFB
* TASK-14.1.2 Measure SPA latency

---

# 📦 EPIC-15: Release & Governance

### STORY-15.1: v1.0 Release

**Acceptance Criteria**

* Stable APIs
* Versioned release

**Tasks**

* TASK-15.1.1 Tag v1.0
* TASK-15.1.2 Publish roadmap

---

## ✅ Final Note

This Jira breakdown:

* Covers **every subsystem**
* Is **implementation-accurate**
* Supports **solo dev or team scaling**
* Prevents architectural drift
