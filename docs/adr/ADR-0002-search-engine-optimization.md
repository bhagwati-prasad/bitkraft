# ADR-0002: SEO-First Page (Route) Guidelines

**Status**: Accepted
**Date**: 2026-01-11
**Decision Makers**: BitKraft Core Team
**Related**: SPEC v1.0, ADR-0001 (Framework Scope)

---

## 1. Context

BitKraft is a hybrid SSR–SPA framework whose primary differentiator is **deterministic rendering and navigation**. Unlike hydration-based frameworks, BitKraft renders complete HTML on the server and upgrades to SPA behavior only after the initial load.

Search engines prioritize:

* Deterministic, crawlable HTML
* Stable DOM structures
* Predictable metadata
* Strong internal link graphs
* Performance signals (Core Web Vitals)

If SEO is treated as an *afterthought* at the page level, the framework’s architectural advantages are wasted.

Therefore, BitKraft requires **explicit, enforceable SEO guidelines per route**.

---

## 2. Decision

All pages (routes) in BitKraft **MUST comply** with the SEO guidelines defined in this ADR.

SEO is declared a **first-class concern**, enforced at:

* Route definition time
* Server render time
* Build time (static analysis)

Failure to comply **blocks production builds**.

---

## 3. SEO as a First-Class Module

### 3.1 Rule

SEO MUST NOT be embedded ad-hoc inside templates or features.

### 3.2 Decision

BitKraft introduces a **Core SEO Module**.

```
backend/core/seo/
├── meta.ts
├── openGraph.ts
├── twitter.ts
├── schema.ts
├── sitemap.ts
└── robots.ts
```

### 3.3 Route-Level SEO Contract

Every route MUST define an SEO configuration:

```ts
seo: {
  title: (ctx) => string,
  description: (ctx) => string,
  canonical: (ctx) => string,
  indexable: boolean,
  openGraph?: object,
  schema?: object
}
```

Routes without SEO configuration **fail build validation**.

---

## 4. Metadata Guidelines (Mandatory)

### 4.1 Title

* Exactly **one** `<title>` tag per page
* Max length: **60 characters**
* MUST be rendered on the server

### 4.2 Meta Description

* Exactly **one** `<meta name="description">`
* Length: **120–160 characters**
* MUST be content-specific

### 4.3 Canonical URL

* MUST be absolute
* MUST match the preferred crawl URL
* MUST be stable across SSR and SPA

### 4.4 Robots Meta

```html
<meta name="robots" content="index,follow">
```

* `noindex` MUST be explicit
* Implicit noindex is forbidden

---

## 5. Deterministic Head Rendering

### 5.1 Rule

The `<head>` MUST be deterministic and server-controlled.

### 5.2 Constraints

* No client-side head mutations
* No reconciliation or diffing
* No multiple competing sources

### 5.3 SPA Navigation Rule

On SPA navigation:

* Server returns **head fragment as JSON**
* Client replaces `<head>` atomically

This prevents:

* Duplicate meta tags
* Title flicker
* Partial indexing

---

## 6. HTML-First Cache Strategy

### 6.1 Rule

Rendered HTML is the **primary cache artifact**.

### 6.2 Cache Priority

1. Full HTML (SSR)
2. JSON page payload
3. Domain data

### 6.3 SEO Cache Policy

* SEO-critical routes MUST cache HTML
* Cache invalidation MUST be tag-based

Example:

```
/blog/post-1
  HTML TTL: 1 hour
  JSON TTL: 5 minutes
```

---

## 7. Bot-Aware Rendering

### 7.1 Rule

Bots MUST always receive full SSR HTML.

### 7.2 Bot Rendering Constraints

For crawler requests:

* SPA mode disabled
* JSON payloads disabled
* Optional reduction of non-critical JS

### 7.3 Rationale

* Avoid hydration timeouts
* Avoid JS execution limits
* Guarantee full content visibility

---

## 8. Indexability Rules

### 8.1 Indexable Pages

A page is indexable only if:

* `indexable: true`
* Canonical URL exists
* Page is reachable via internal links

### 8.2 Non-Indexable Pages

Examples:

* Admin
* User drafts
* Internal tools

These MUST explicitly set:

```
<meta name="robots" content="noindex,nofollow">
```

---

## 9. Link Graph Guidelines

### 9.1 Core Rule

Every indexable page MUST be reachable by **at least one static `<a href>` link**.

### 9.2 Internal Linking

* Use native `<a>` elements
* Avoid JS-only navigation
* Avoid click handlers without href

### 9.3 Link Depth

* Important pages SHOULD be within **3 clicks** of entry points
* Category hubs are REQUIRED for large content sets

---

## 10. Crawl Graph Optimization

### 10.1 Structural Pages

The framework SHOULD expose:

* Category pages
* Tag pages
* Pagination pages

### 10.2 Breadcrumbs

Indexable pages SHOULD include:

* Semantic breadcrumb markup
* Schema.org BreadcrumbList

---

## 11. Built-In Sitemap & RSS Generation

### 11.1 Sitemap

* Generated from Route Registry
* Includes only indexable routes
* Updated automatically on cache invalidation

Endpoints:

```
/sitemap.xml
/sitemap-index.xml
```

### 11.2 RSS / Feeds

Optional but recommended:

```
/rss.xml
/feed.json
```

Feeds MUST:

* Use canonical URLs
* Contain full content summaries

---

## 12. Core Web Vitals Guardrails

### 12.1 LCP

* Primary content MUST be in initial HTML
* No JS-dependent rendering

### 12.2 CLS

* No layout changes after SSR
* Image and media dimensions REQUIRED

### 12.3 INP / TBT

* Avoid blocking scripts
* Lazy-load non-critical features

Violations fail performance checks.

---

## 13. SEO Checklist Enforced at Build Time

### 13.1 Build-Time Validation Rules

Each route is validated for:

* [ ] Title present
* [ ] Description present
* [ ] Canonical present
* [ ] Indexability declared
* [ ] At least one inbound internal link
* [ ] Sitemap inclusion decision
* [ ] No duplicate head tags
* [ ] Image dimensions set

### 13.2 Failure Policy

* Any missing mandatory item → **Build fails**
* Warnings allowed only for optional items

---

## 14. Consequences

### Positive

* Predictable SEO behavior
* Zero hydration SEO bugs
* Strong crawl graphs
* Superior Core Web Vitals

### Negative

* More upfront discipline
* Slightly more configuration per route

This tradeoff is intentional.

---

## 15. Final Statement

> **In BitKraft, a page that is not SEO-complete is considered architecturally incomplete.**

SEO correctness is enforced by design, not developer memory.

---