# Phase 1 Testing Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start server
npm run dev

# Open browser
open http://localhost:3000
```

## Manual Testing

### 1. SSR Mode Test

**Objective:** Verify server-side rendering works

**Steps:**
1. Open `http://localhost:3000` in browser
2. Right-click → "View Page Source"
3. Verify full HTML is present (not empty `<div id="app">`)
4. Check browser console for: `[ContentNegotiator] GET / → SSR (first-load)`

**Expected:** Full HTML rendered, features initialized

---

### 2. SPA Navigation Test

**Objective:** Verify client-side navigation works without reload

**Steps:**
1. Open `http://localhost:3000`
2. Open DevTools Console
3. Click "Learn More" button
4. Observe console logs (no page reload)
5. Verify URL changed to `/about`
6. Click "Back to Home"
7. Verify URL changed to `/`

**Expected Console Output:**
```
[SPARouter] Navigating to: /about
[LifecycleManager] Destroying active features
[Hero] Destroying...
[Footer] Destroying...
[LifecycleManager] Initializing features: ['team', 'footer']
[Team] Initializing...
[Footer] Initializing...
[SPARouter] Navigation complete
```

---

### 3. Lifecycle Test

**Objective:** Verify features are properly cleaned up

**Steps:**
1. Open browser console
2. Navigate: Home → About → Home → About (4 times)
3. Run: `window.__BITKRAFT__.lifecycleManager.getActiveFeatureCount()`
4. Should return `2` (not accumulating)
5. Run: `window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames()`
6. Should show current page features only

**Expected:** No memory leaks, old features destroyed

---

### 4. Browser History Test

**Objective:** Verify back/forward buttons work

**Steps:**
1. Navigate: Home → About → Home
2. Click browser Back button (should go to About)
3. Click browser Forward button (should go to Home)
4. Check console for proper lifecycle calls

**Expected:** Browser navigation triggers SPA navigation

---

### 5. Bot Detection Test

**Objective:** Verify bots get SSR

**In terminal:**
```bash
# Test with Googlebot user agent
curl -A "Googlebot" http://localhost:3000

# Should return full HTML

# Test with SPA header
curl -H "X-BitkRaft-SPA: true" http://localhost:3000

# Should return JSON
```

**Expected:**
- Bots get HTML
- SPA requests get JSON

---

## Automated Testing

### Using curl

```bash
# Test SSR mode (first load)
curl -s http://localhost:3000 | grep "<title>"

# Test JSON payload (SPA mode)
curl -s -H "X-BitkRaft-SPA: true" http://localhost:3000 | jq .

# Test about page
curl -s -H "X-BitkRaft-SPA: true" http://localhost:3000/about | jq .

# Test bot detection
curl -s -A "Googlebot" http://localhost:3000 | grep "<title>"
```

### Using fetch (Browser Console)

```javascript
// Test SPA navigation
fetch('/about', {
  headers: {
    'X-BitkRaft-SPA': 'true',
    'Accept': 'application/json'
  }
})
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## Debugging

### Check Runtime State

```javascript
// In browser console

// BitKraft info
window.__BITKRAFT__

// Current phase
window.__BITKRAFT__.phase // Should be 1

// Active features
window.__BITKRAFT__.lifecycleManager.getActiveFeatureNames()

// Feature count
window.__BITKRAFT__.lifecycleManager.getActiveFeatureCount()

// Initial state
window.__BITKRAFT__.getState()
```

### Enable Verbose Logging

Server logs are enabled by default in development. Check terminal for:

```
[ContentNegotiator] GET / → SSR (first-load)
[ContentNegotiator] GET /about → SPA (spa-navigation)
```

---

## Common Issues

### Issue: Features not loading

**Symptom:** Console shows feature not found errors

**Solution:**
1. Check file paths in `public/js/features/`
2. Verify file names match route definitions
3. Check browser DevTools Network tab

### Issue: Navigation reloads page

**Symptom:** Full page reload on click

**Solution:**
1. Check SPA Router is initialized
2. Verify link click handler is attached
3. Check console for router errors

### Issue: Memory leaks

**Symptom:** Active feature count increases on navigation

**Solution:**
1. Verify `destroy()` is implemented in all features
2. Check event listeners are removed
3. Use Chrome DevTools Memory profiler

---

## Performance Checks

### Bundle Size

```bash
# Check file sizes
ls -lh public/js/**/*.js
```

Phase 1 targets:
- Runtime: <10KB
- Each feature: <5KB

### Load Time

1. Open DevTools Network tab
2. Disable cache
3. Hard refresh
4. Check:
   - DOMContentLoaded: <100ms
   - Load: <200ms
   - First Paint: <100ms

---

## Exit Criteria Verification

✅ **SSR works:** First load returns full HTML  
✅ **SPA works:** Navigation fetches JSON, no reload  
✅ **Lifecycle works:** Features init/destroy properly  
✅ **No leaks:** Active feature count stays correct  
✅ **History works:** Back/forward buttons work  
✅ **Bots work:** User-Agent detection works  

---

## Next Steps

Once all tests pass, proceed to **Phase 2: Vite Integration**

See [phases.md](../phases.md) for Phase 2 details.
