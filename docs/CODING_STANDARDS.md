# BitKraft Framework - Coding Standards

**Version:** 1.0  
**Last Updated:** January 11, 2026

---

## Table of Contents

1. [General Principles](#general-principles)
2. [File Structure](#file-structure)
3. [Naming Conventions](#naming-conventions)
4. [Code Style](#code-style)
5. [TypeScript Guidelines](#typescript-guidelines)
6. [Documentation](#documentation)
7. [Testing](#testing)
8. [Git Workflow](#git-workflow)

---

## General Principles

### 1. Simplicity Over Cleverness

```javascript
// ❌ Bad: Too clever
const f = (a) => a.reduce((p, c) => p + c, 0);

// ✅ Good: Clear intent
function calculateTotal(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}
```

### 2. Explicit Over Implicit

```javascript
// ❌ Bad: Magic behavior
class Feature {
  constructor() {
    this.autoInit(); // Unexpected side effect
  }
}

// ✅ Good: Explicit initialization
class Feature {
  async init(context) {
    // Clear lifecycle point
  }
}
```

### 3. Standards Over Abstractions

```javascript
// ❌ Bad: Custom event system
this.emit('click', data);

// ✅ Good: Native events
element.dispatchEvent(new CustomEvent('featureClick', { detail: data }));
```

### 4. Frontend Efficiency First

**Frontend performance is CRITICAL.** Every decision must consider:

```javascript
// ❌ Bad: Unnecessary DOM queries in loops
for (let i = 0; i < items.length; i++) {
  document.querySelector('.container').appendChild(items[i]);
}

// ✅ Good: Query once, batch operations
const container = document.querySelector('.container');
const fragment = document.createDocumentFragment();
for (let i = 0; i < items.length; i++) {
  fragment.appendChild(items[i]);
}
container.appendChild(fragment);
```

**Key Rules:**
- Minimize DOM operations (batch updates, use fragments)
- Avoid layout thrashing (read/write separation)
- Lazy load non-critical resources
- Optimize event listeners (delegation, passive listeners)
- Remove unused code and dependencies
- Profile before optimizing, but optimize aggressively

---

## File Structure

### Framework Structure

```
bitkraft/
├── src/
│   ├── server/          # Backend code
│   │   ├── core/        # Core framework modules
│   │   ├── middleware/  # Express middleware
│   │   └── utils/       # Server utilities
│   ├── client/          # Frontend code
│   │   ├── core/        # Core runtime
│   │   ├── features/    # Built-in features
│   │   └── utils/       # Client utilities
│   ├── shared/          # Isomorphic code
│   └── cli/             # CLI tools
├── docs/                # Documentation
│   ├── adr/             # Architecture Decision Records
│   ├── specs/           # Technical specifications
│   └── implement/       # Implementation guides
├── examples/            # Example applications
├── tests/               # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── SPEC.md
├── ARCH.md
└── README.md
```

### Feature Structure

```
features/
└── feature-name/
    ├── feature-name.js       # Main entry point
    ├── feature-name.css      # Styles
    ├── feature-name.test.js  # Tests
    └── README.md             # Feature docs
```

---

## Naming Conventions

### Files and Folders

```
// Use kebab-case for files and folders
content-negotiator.js
feature-loader.js
lifecycle-manager.js

// Use PascalCase for classes that are the default export
class ContentNegotiator { }  // in content-negotiator.js
```

### Variables and Functions

```javascript
// camelCase for variables and functions
const userName = 'John';
function fetchUserData() { }

// PascalCase for classes and constructors
class FeatureLoader { }

// UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
```

### Naming Patterns

```javascript
// Boolean variables: use is/has/should prefix
const isLoading = true;
const hasError = false;
const shouldRetry = true;

// Functions: use verb + noun
function getUserData() { }
function validateInput() { }
function renderTemplate() { }

// Event handlers: use handle prefix
function handleClick(event) { }
function handleSubmit(event) { }

// Async functions: name indicates async nature
async function fetchData() { }
async function loadFeature() { }
```

---

## Code Style

### Formatting

- **Indent:** 2 spaces (no tabs)
- **Line length:** Max 100 characters
- **Quotes:** Single quotes for strings
- **Semicolons:** Required
- **Trailing commas:** Yes for multi-line

```javascript
// ✅ Good formatting
const config = {
  name: 'BitKraft',
  version: '1.0.0',
  features: ['ssr', 'spa', 'caching'],
};
```

### Function Structure

```javascript
// Small, focused functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Avoid large functions (>50 lines)
// Break into smaller functions
```

### Error Handling

```javascript
// ✅ Good: Explicit error handling
async function loadFeature(name) {
  try {
    const module = await import(`./features/${name}.js`);
    return module;
  } catch (error) {
    logger.error('Feature load failed', { name, error });
    throw new FeatureLoadError(`Failed to load feature: ${name}`, { cause: error });
  }
}

// ❌ Bad: Silent failures
async function loadFeature(name) {
  try {
    return await import(`./features/${name}.js`);
  } catch (e) {
    return null; // Silent failure
  }
}
```

### Comments

```javascript
// Use comments to explain WHY, not WHAT

// ❌ Bad: Obvious comment
// Increment counter by 1
counter++;

// ✅ Good: Explains reasoning
// Cache must be invalidated before navigation to prevent stale data
// from being shown when user uses browser back button
cache.invalidate();

// Use JSDoc for public APIs
/**
 * Initializes a feature with the given context.
 * @param {FeatureContext} context - The feature initialization context
 * @returns {Promise<void>}
 * @throws {FeatureInitError} If initialization fails
 */
async function initFeature(context) { }
```

---

## TypeScript Guidelines

### Type Annotations

```typescript
// ✅ Good: Explicit types for public APIs
export interface FeatureContext {
  route: Route;
  data: Record<string, unknown>;
  element: HTMLElement;
}

export async function init(context: FeatureContext): Promise<void> {
  // Implementation
}

// Type inference is OK for local variables
const count = 5; // inferred as number
const items = []; // consider adding explicit type if empty
```

### Interface vs Type

```typescript
// Use interface for objects
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type for unions, primitives
type Status = 'loading' | 'success' | 'error';
type ID = string | number;
```

### Avoid `any`

```typescript
// ❌ Bad
function processData(data: any) { }

// ✅ Good: Use unknown and narrow
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // Process validated data
  }
}

// ✅ Good: Use generics
function processData<T>(data: T): T {
  return data;
}
```

---

## Documentation

### Code Documentation

```javascript
/**
 * Content Negotiator decides whether to render SSR or SPA mode.
 * 
 * This is the central decision point for BitKraft's hybrid rendering.
 * It examines request headers, user agent, and navigation state to
 * determine the appropriate response mode.
 * 
 * @example
 * const mode = contentNegotiator.negotiate(req);
 * if (mode === 'SSR') {
 *   return renderFullHTML();
 * } else {
 *   return renderJSON();
 * }
 */
export class ContentNegotiator { }
```

### README Template

Every feature/module should have:

```markdown
# Feature Name

## Purpose
What this feature does and why it exists.

## Usage
```javascript
import { feature } from './feature.js';
await feature.init(context);
```

## API
- `init(context)` - Initialize the feature
- `destroy()` - Clean up resources

## Dependencies
- None / List dependencies

## Testing
How to test this feature
```

---

## Testing

### Test-Driven Development (TDD)

**BitKraft follows strict TDD principles:**

1. **Red** → Write a failing test first
2. **Green** → Write minimal code to pass
3. **Refactor** → Clean up while tests pass

**Why TDD for BitKraft:**
- Prevents regressions in lifecycle management
- Documents expected behavior
- Ensures testability by design
- Catches memory leaks early
- Validates SSR/SPA mode switching

### Test Structure

```javascript
// feature-name.test.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Feature } from './feature-name.js';

describe('Feature', () => {
  let feature;

  beforeEach(() => {
    feature = new Feature();
  });

  afterEach(() => {
    feature.destroy();
  });

  it('should initialize correctly', async () => {
    await feature.init({ element: document.body });
    expect(feature.isInitialized).toBe(true);
  });

  it('should clean up on destroy', async () => {
    await feature.init({ element: document.body });
    await feature.destroy();
    expect(feature.listeners).toHaveLength(0);
  });
});
```

### Test Coverage Requirements

**Mandatory Coverage Levels:**
- **Core framework:** >80% line coverage
- **Server modules:** >75% line coverage
- **Client runtime:** >80% line coverage
- **Features:** >70% line coverage

**Test Types:**
- **Unit tests:** Core logic, utilities, pure functions
- **Integration tests:** Component interactions, lifecycle flows
- **E2E tests:** Critical user flows (SSR → SPA navigation)

### TDD Workflow Example

```javascript
// 1. RED: Write failing test first
it('should destroy feature and remove event listeners', async () => {
  const element = document.createElement('div');
  const feature = new Feature();
  
  await feature.init({ element });
  const listenerCount = getEventListenerCount(element);
  
  await feature.destroy();
  
  // This will fail initially
  expect(getEventListenerCount(element)).toBe(0);
  expect(listenerCount).toBeGreaterThan(0);
});

// 2. GREEN: Implement minimum code to pass
export class Feature {
  async destroy() {
    // Remove listeners
    this.cleanup();
  }
}

// 3. REFACTOR: Improve while keeping tests green
export class Feature {
  async destroy() {
    if (this.cleanup) {
      await this.cleanup();
      this.cleanup = null;
    }
  }
}
```

### Test Naming

```javascript
// Pattern: should [expected behavior] when [condition]
it('should return cached data when cache is warm', () => { });
it('should fetch fresh data when cache is expired', () => { });
it('should throw error when feature not found', () => { });

// For lifecycle tests, be explicit
it('should remove all event listeners on destroy', () => { });
it('should nullify references after destroy', () => { });
it('should call init only once per instance', () => { });
```

### Test Requirements Before Merge

**Pre-merge Checklist:**
- [ ] All new code has corresponding tests
- [ ] Tests written before implementation (TDD)
- [ ] Coverage targets met
- [ ] Tests pass in CI
- [ ] No skipped or pending tests without justification
- [ ] Integration tests for new features
- [ ] E2E tests updated if user flow changed

---

## Git Workflow

### Commit Messages

Format: `type(scope): message`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

Examples:
```
feat(router): add support for dynamic routes
fix(cache): prevent race condition in invalidation
docs(adr): add ADR-021 for streaming SSR
refactor(lifecycle): simplify destroy logic
test(negotiator): add bot detection tests
chore(deps): upgrade vite to 5.1.0
```

### Branch Naming

```
feature/dynamic-routing
fix/cache-race-condition
docs/update-readme
refactor/lifecycle-manager
```

### Pull Request Template

```markdown
## Description
What does this PR do?

## Related Issues
Fixes #123

## Changes
- Added X
- Fixed Y
- Updated Z

## Testing
How was this tested?

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] ADR created (if architectural change)
```

---

## Enforcement

These standards are enforced via:

1. **ESLint** - Code style and quality
2. **Prettier** - Code formatting
3. **TypeScript** - Type checking
4. **Husky** - Pre-commit hooks
5. **Code review** - Manual checks

---

## Questions?

For clarifications or amendments, create an issue or RFC.

---

*These standards are living and may be updated via RFC process.*
