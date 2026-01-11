Below is a **Decision Log Timeline** for **BitKraft Framework**, designed to complement the ADRs.

This document answers **“what was decided, when, and why”** at a glance and is ideal for:

* Core maintainers
* New contributors
* Architectural audits
* Open-source governance

You can store this as:

```
docs/decision-log.md
```

---

# **BitKraft Framework – Decision Log Timeline**

**Version:** v1.0
**Scope:** Framework-level architectural decisions
**Audience:** Core maintainers, contributors, reviewers

---

## 📍 Phase 0 — Problem Framing & Motivation

### **DL-000**

**Date:** 2025-Q4
**Decision:** Build a new hybrid framework instead of using existing SSR/SPAs
**Status:** Accepted

**Rationale:**

* Existing frameworks (Next.js, Nuxt, etc.) introduce hydration complexity
* SPA memory leaks in long-lived sessions
* Poor control over asset lifecycle
* Heavy abstractions over native browser behavior

**Outcome:**

* Commitment to a **custom hybrid SSR–SPA architecture**
* Focus on discipline over convenience

---

## 📍 Phase 1 — Core Rendering Model

### **DL-001**

**Date:** 2025-Q4
**Decision:** Adopt a hybrid SSR + SPA rendering model
**ADR:** ADR-001
**Status:** Accepted

**Key Choice:**

* SSR for first load & crawlers
* JSON payloads for internal navigation

**Why:**

* SEO without compromise
* SPA-like performance after load

---

### **DL-002**

**Date:** 2025-Q4
**Decision:** Centralize render-mode selection
**ADR:** ADR-002
**Status:** Accepted

**Key Choice:**

* Introduce a **Content Negotiator**
* Controllers are render-mode agnostic

**Why:**

* Avoid inconsistent behavior
* Enable future evolution (e.g., streaming, edge SSR)

---

## 📍 Phase 2 — Rendering Discipline

### **DL-003**

**Date:** 2025-Q4
**Decision:** No hydration, no Virtual DOM
**ADR:** ADR-003
**Status:** Accepted

**Key Choice:**

* Deterministic HTML
* No reconciliation or diffing

**Why:**

* Eliminate hydration bugs
* Reduce runtime cost
* Improve predictability

---

### **DL-004**

**Date:** 2025-Q4
**Decision:** JSON page payloads instead of HTML fragments
**ADR:** ADR-007
**Status:** Accepted

**Key Choice:**

* Server sends structured JSON
* Client controls DOM updates

**Why:**

* Better separation of concerns
* Improved caching and offline potential

---

## 📍 Phase 3 — Frontend Runtime Discipline

### **DL-005**

**Date:** 2025-Q4
**Decision:** SPA Router as single navigation authority
**Status:** Accepted

**Key Choice:**

* All navigation intercepted
* History API controlled centrally

**Why:**

* Predictable lifecycle
* Enables scroll restoration and cleanup

---

### **DL-006**

**Date:** 2025-Q4
**Decision:** Mandatory lifecycle hooks for features
**ADR:** ADR-006
**Status:** Accepted

**Key Choice:**

* Every feature implements `init()` and `destroy()`

**Why:**

* Prevent memory leaks
* Support long-lived sessions
* Explicit ownership of resources

---

### **DL-007**

**Date:** 2025-Q4
**Decision:** Feature-based architecture over page-based
**ADR:** ADR-005
**Status:** Accepted

**Key Choice:**

* Features encapsulate UI, state, logic, styles
* Pages compose features

**Why:**

* Better modularity
* Easier reuse
* Cleaner teardown

---

## 📍 Phase 4 — Caching & Performance

### **DL-008**

**Date:** 2026-Q1
**Decision:** Make caching a first-class architectural concern
**ADR:** ADR-008
**Status:** Accepted

**Key Choice:**

* Unified cache manager
* HTML + JSON caching
* TTL and tag-based invalidation

**Why:**

* Offset SSR cost
* Enable high throughput
* Improve perceived performance

---

### **DL-009**

**Date:** 2026-Q1
**Decision:** Client-side persistent storage abstraction
**Status:** Accepted

**Key Choice:**

* IndexedDB as default
* Unified storage adapter

**Why:**

* Faster navigation
* Offline-friendly foundation
* Reduced server load

---

## 📍 Phase 5 — Build & Tooling

### **DL-010**

**Date:** 2026-Q1
**Decision:** Adopt Vite as the official bundler
**ADR:** ADR-004
**Status:** Accepted

**Key Choice:**

* Vite dev server
* ESM-native builds
* Manifest-driven SSR asset resolution

**Why:**

* Fast iteration
* Fine-grained code splitting
* Minimal tooling complexity

---

### **DL-011**

**Date:** 2026-Q1
**Decision:** Feature-level entry points in build system
**Status:** Accepted

**Key Choice:**

* One Vite entry per feature
* Lazy-loaded feature bundles

**Why:**

* Memory hygiene
* Faster initial load
* Cleaner lifecycle boundaries

---

## 📍 Phase 6 — Framework Positioning

### **DL-012**

**Date:** 2026-Q1
**Decision:** Framework is rendering/navigation/lifecycle focused, not UI
**ADR:** ADR-009
**Status:** Accepted

**Key Choice:**

* No UI framework
* No component abstraction imposed

**Why:**

* Avoid lock-in
* Preserve browser-native power
* Keep framework lightweight

---

## 📍 Phase 7 — Governance & Evolution

### **DL-013**

**Date:** 2026-Q1
**Decision:** Use ADRs for all major architectural changes
**Status:** Accepted

**Key Choice:**

* Every breaking or foundational change requires an ADR

**Why:**

* Prevent architectural drift
* Enable long-term maintainability
* Improve contributor onboarding

---

## 🔮 Future (Not Yet Decided)

The following are **explicitly deferred** decisions:

* Plugin system API
* Auth & session architecture
* Edge / streaming SSR
* Worker-based execution
* Partial hydration (intentionally unlikely)

These require **new ADRs**.

---

## 🧭 How to Use This Log

* **Before proposing changes:** Check for conflicting decisions
* **When onboarding contributors:** Read this before code
* **When evolving the framework:** Add a new entry, do not rewrite history

---

## Final Note

This decision log represents the **architectural spine** of BitKraft.

If you ever ask:

> *“Why is BitKraft like this?”*

The answer should exist either:

* In an ADR
* Or in this decision log timeline

---