# BitKraft Control Flow Documentation

## First Page Load Control Flow

### Backend Control Flow (SSR Mode)

```
1. HTTP Request Arrives
   ↓
2. Express Server (src/server/index.js)
   - Receives GET request (e.g., GET /)
   ↓
3. Static Files Middleware
   - Checks if request is for /public/* assets
   - If yes → serve static file and exit
   - If no → continue
   ↓
4. Content Negotiator Middleware (src/server/middleware/content-negotiator.js)
   - Checks User-Agent header
   - Checks for X-BitkRaft-SPA header
   - Decision:
     * Bot detected → SSR mode
     * SPA header present → SPA mode
     * First load → SSR mode (default)
   - Sets req.renderMode = 'SSR'
   - Sets req.reason = 'first-load'
   ↓
5. Route Handler (src/server/index.js)
   - Receives request at app.get('*')
   ↓
6. Route Registry (src/server/core/route-registry.js)
   - findRoute(req.path) called
   - Looks up route definition
   - Returns route object with:
     * path, name, controller
     * features array
     * meta information
   ↓
7. Controller Lookup
   - Gets controller from controllers map
   - Controller is render-mode agnostic
   ↓
8. Controller Execution (src/server/controllers/*.js)
   - homeController() or aboutController()
   - Fetches/prepares page data
   - Returns { data, meta }
   ↓
9. Render Decision
   - Checks req.renderMode === 'SSR'
   ↓
10. SSR Renderer (src/server/core/ssr-renderer.js)
    - renderPage(route, pageData) called
    - Creates template context:
      * meta (title, description)
      * data (page-specific data)
      * route (path, name)
      * features (array of feature names)
    ↓
11. EJS Template Rendering
    - Renders layout.ejs (src/templates/layout.ejs)
    - Includes navigation
    - Includes page template (pages/home.ejs or pages/about.ejs)
    - Injects __BITKRAFT_STATE__ script tag with initial data
    - Adds runtime script
    - Adds feature scripts
    ↓
12. HTTP Response
    - Sets Content-Type: text/html
    - Sends complete HTML document
    - Response complete
```

### Frontend Control Flow (Client-Side Initialization)

```
1. Browser Receives HTML
   ↓
2. HTML Parsing
   - Parses DOCTYPE, <html>, <head>
   - Loads CSS (/public/css/main.css)
   - Parses <body>
   - Renders navigation
   - Renders main content (#app)
   ↓
3. Script Tag Discovery
   - Finds __BITKRAFT_STATE__ JSON script
   - Finds inline module script
   ↓
4. Module Script Execution (inline in layout.ejs)
   - import BitKraftRuntime from '/public/js/runtime.js'
   - Browser fetches runtime.js
   - Fetches dependencies:
     * /public/js/core/router.js
     * /public/js/core/lifecycle-manager.js
   ↓
5. Runtime Initialization Check
   - if (document.readyState === 'loading')
     → Add DOMContentLoaded listener
   - else
     → Initialize immediately
   ↓
6. BitKraftRuntime.init() (public/js/runtime.js)
   - Logs: '[BitKraft] Initializing runtime...'
   ↓
7. Extract Initial State
   - Finds #__BITKRAFT_STATE__ element
   - Parses JSON content
   - Stores in this.initialState
   - Logs: '[BitKraft] Initial state loaded'
   ↓
8. Create LifecycleManager
   - new LifecycleManager()
   - Initializes empty activeFeatures Map
   ↓
9. Create and Initialize Router
   - new Router(lifecycleManager)
   - router.init() called
   ↓
10. Router Initialization (public/js/core/router.js)
    - Gets current route from #app data-route attribute
    - Sets this.currentRoute
    - Attaches click listener: document.addEventListener('click', boundHandleClick)
    - Attaches popstate listener: window.addEventListener('popstate', boundHandlePopState)
    - Logs: '[Router] Initialized on route: /'
    - Logs: '[Router] Event listener attached to document'
    ↓
11. Query DOM for Features
    - Finds #app element
    - querySelectorAll('[data-feature]')
    - Extracts feature names from data-feature attributes
    - Example: ['hero', 'footer'] or ['team', 'footer']
    ↓
12. Initialize Features (public/js/core/lifecycle-manager.js)
    - lifecycleManager.initFeatures(featureNames, initialState.data)
    - Logs: '[LifecycleManager] Initializing features: ['hero', 'footer']'
    ↓
13. For Each Feature:
    - Dynamic import: import(`/public/js/features/${featureName}.js`)
    - Browser fetches feature module
    - Finds element: querySelector(`[data-feature="${featureName}"]`)
    - Creates context: { element, data, route }
    - Calls featureModule.init(context)
    ↓
14. Feature Initialization (public/js/features/*.js)
    - Feature receives context
    - Queries its own DOM elements
    - Attaches event listeners
    - Stores cleanup references
    - Adds 'feature-initialized' class
    - Logs: '[Hero] Initialized' or '[Team] Initialized'
    ↓
15. Store Feature Reference
    - LifecycleManager stores:
      * module reference
      * element reference
      * context
    - In activeFeatures Map
    - Logs: '[LifecycleManager] Feature initialized: hero'
    ↓
16. Complete Initialization
    - Logs: '[BitKraft] Runtime initialized'
    - Logs: '[BitKraft] Active features: ['hero', 'footer']'
    ↓
17. Expose Debug Interface
    - window.__BITKRAFT__ = {
        version, phase, lifecycleManager, router, getState
      }
    ↓
18. Page Ready
    - All features initialized
    - Router listening for clicks
    - SPA navigation ready
    - Page fully interactive
```

### Key Files Involved

**Backend:**
- `src/server/index.js` - Express server & route handler
- `src/server/middleware/content-negotiator.js` - SSR/SPA decision
- `src/server/core/route-registry.js` - Route definitions
- `src/server/core/ssr-renderer.js` - HTML rendering
- `src/server/controllers/*.js` - Page data controllers
- `src/templates/layout.ejs` - HTML template
- `src/templates/pages/*.ejs` - Page templates

**Frontend:**
- `public/js/runtime.js` - Main runtime orchestrator
- `public/js/core/router.js` - SPA navigation router
- `public/js/core/lifecycle-manager.js` - Feature lifecycle
- `public/js/features/*.js` - Individual features

### State After First Load

**Backend:**
- Express server continues listening
- Ready for next request (SSR or SPA)

**Frontend:**
- Runtime initialized
- Router attached to document clicks
- All features initialized with event listeners
- LifecycleManager tracking active features
- Ready for SPA navigation

---

## Successive Page Load Control Flow (SPA Mode)

### Frontend Control Flow (Client-Side Navigation)

```
1. User Clicks Link
   - User clicks <a href="/about"> or <a href="/">
   ↓
2. Click Event Bubbles
   - Event propagates up DOM tree
   - Reaches document level
   ↓
3. Router Click Handler (public/js/core/router.js)
   - boundHandleClick() receives event
   - Logs: '[Router] Click detected on: <element>'
   ↓
4. Find Closest Link
   - event.target.closest('a')
   - Finds the <a> element
   - If not found → return (ignore click)
   ↓
5. Extract href Attribute
   - link.getAttribute('href')
   - Gets href value (e.g., '/about')
   - Logs: '[Router] Link href: /about'
   ↓
6. Validate Link Type
   - Checks if href starts with 'http' → external, allow default
   - Checks if href starts with '#' → hash, allow default
   - Checks if href is empty → ignore
   - Internal link → continue
   - Logs: '[Router] Preventing default and navigating'
   ↓
7. Prevent Default & Stop Propagation
   - event.preventDefault() → stops browser navigation
   - event.stopPropagation() → stops other handlers
   ↓
8. Call navigateTo(href)
   - router.navigateTo('/about')
   - Logs: '[Router] Navigating to: /about'
   ↓
9. Navigation Guards
   - Checks if (this.isNavigating) → already in progress, abort
   - Checks if (path === this.currentRoute) → already on route, abort
   - Sets this.isNavigating = true
   ↓
10. Fetch JSON Payload
    - fetch(path, {
        headers: {
          'X-BitkRaft-SPA': 'true',
          'Accept': 'application/json'
        }
      })
    - Browser sends HTTP request to server
    ↓
11. [BACKEND PROCESSING - See Backend Flow Below]
    ↓
12. Receive JSON Response
    - response.json() → parses JSON payload
    - Payload contains: { route, data, meta, html, timestamp }
    - Logs: '[Router] Payload received: {...}'
    - Logs: '[Router] HTML in payload: true'
    ↓
13. Destroy Current Features
    - lifecycleManager.destroyCurrentFeatures()
    - Logs: '[LifecycleManager] Destroying active features'
    ↓
14. For Each Active Feature:
    - Gets feature from activeFeatures Map
    - Calls feature.module.destroy()
    - Feature removes event listeners
    - Feature clears references
    - Logs: '[Hero] Destroying...'
    - Logs: '[LifecycleManager] Feature destroyed: hero'
    ↓
15. Clear Feature Map
    - activeFeatures.clear()
    - All old features destroyed
    ↓
16. Update DOM (router.updateDOM)
    - Gets #app element
    - Updates document.title from payload.meta.title
    - Updates meta description tag
    - Logs: '[Router] Replacing HTML, length: 567'
    ↓
17. Replace Page Content
    - app.innerHTML = payload.html
    - Injects new page HTML into #app
    - Old DOM elements removed
    - New DOM elements created
    - Sets app.setAttribute('data-route', payload.route.path)
    ↓
18. Verify New Elements
    - querySelectorAll('[data-feature]')
    - Logs: '[Router] Features in new DOM: ['team', 'footer']'
    - Logs: '[Router] DOM updated with new HTML for route: /about'
    ↓
19. Update Browser History
    - window.history.pushState({ path }, '', path)
    - Browser URL changes to /about
    - No page reload
    - Back button will work
    ↓
20. Initialize New Features
    - lifecycleManager.initFeatures(payload.route.features, payload.data)
    - Logs: '[LifecycleManager] Initializing features: ['team', 'footer']'
    ↓
21. For Each New Feature:
    - Dynamic import: import(`/public/js/features/${featureName}.js`)
    - Module already cached by browser
    - Finds element: querySelector(`[data-feature="${featureName}"]`)
    - Creates context: { element, data, route }
    - Calls featureModule.init(context)
    - Logs: '[Team] Initializing...'
    - Logs: '[Team] Initialized'
    - Logs: '[LifecycleManager] Feature initialized: team'
    ↓
22. Update Current Route
    - this.currentRoute = path
    - Router tracks new current route
    ↓
23. Scroll to Top
    - window.scrollTo(0, 0)
    - Page scrolls to top
    ↓
24. Complete Navigation
    - Sets this.isNavigating = false
    - Logs: '[Router] Navigation complete'
    ↓
25. Page Ready
    - New page content displayed
    - New features initialized
    - Router ready for next navigation
    - No page reload occurred
```

### Backend Control Flow (SPA Mode)

```
1. HTTP Request Arrives
   - GET /about
   - Headers include:
     * X-BitkRaft-SPA: true
     * Accept: application/json
   ↓
2. Express Server (src/server/index.js)
   - Receives GET request
   ↓
3. Static Files Middleware
   - Checks if request is for /public/* assets
   - Not a static file → continue
   ↓
4. Content Negotiator Middleware (src/server/middleware/content-negotiator.js)
   - Checks User-Agent header
   - Checks for X-BitkRaft-SPA header
   - Header found: 'X-BitkRaft-SPA': 'true'
   - Decision: SPA mode
   - Sets req.renderMode = 'SPA'
   - Sets req.reason = 'spa-navigation'
   - Logs: '[ContentNegotiator] GET /about → SPA (spa-navigation)'
   ↓
5. Route Handler (src/server/index.js)
   - Receives request at app.get('*')
   ↓
6. Route Registry (src/server/core/route-registry.js)
   - findRoute('/about') called
   - Returns route object:
     * path: '/about'
     * name: 'about'
     * controller: 'about'
     * features: ['team', 'footer']
     * meta: { title, description }
   ↓
7. Controller Lookup
   - Gets aboutController from controllers map
   ↓
8. Controller Execution (src/server/controllers/about-controller.js)
   - aboutController(req, res)
   - Controller is render-mode agnostic
   - Prepares page data
   - Returns:
     {
       data: {
         title: 'About BitKraft',
         description: '...',
         principles: [...]
       },
       meta: {
         title: 'About - BitKraft Framework',
         description: '...'
       }
     }
   ↓
9. Render Decision
   - Checks req.renderMode === 'SPA'
   - SPA mode detected
   ↓
10. JSON Renderer (src/server/core/ssr-renderer.js)
    - renderJSON(route, pageData) called
    - Gets pageTemplate path: 'templates/pages/about.ejs'
    ↓
11. Render Page Template Only
    - ejs.renderFile('pages/about.ejs', { data })
    - Renders ONLY the page content (not full layout)
    - No <html>, <head>, <body> tags
    - Only the <section> and <footer> elements
    - HTML includes data-feature attributes
    ↓
12. Build JSON Payload
    - Creates JSON object:
      {
        route: {
          path: '/about',
          name: 'about',
          features: ['team', 'footer']
        },
        data: { title, description, principles },
        meta: { title, description },
        html: '<section>...</section><footer>...</footer>',
        timestamp: 1704988800000
      }
    ↓
13. HTTP Response
    - Sets Content-Type: application/json
    - res.json(payload)
    - Sends JSON payload to client
    - Response complete
    - Server ready for next request
```

### Key Differences from First Load

**Backend:**
- Content negotiator detects SPA header → SPA mode
- Renders ONLY page template (not full layout)
- Returns JSON instead of HTML document
- Much smaller response size
- No CSS/JS re-downloads needed

**Frontend:**
- No full page reload
- Router intercepts click before browser navigation
- Fetches JSON via fetch API
- Destroys old features before DOM update
- Replaces only #app content
- Initializes new features
- Browser history updated via pushState
- URL changes without page reload
- Faster navigation (no parse, no CSS/JS reload)

### State After SPA Navigation

**Backend:**
- Express server continues listening
- Same state as before
- Ready for next request

**Frontend:**
- New page content displayed in #app
- Old features destroyed and cleaned up
- New features initialized with event listeners
- LifecycleManager tracking new active features
- Router still attached to document clicks
- Current route updated
- Browser history entry added
- Ready for next SPA navigation
