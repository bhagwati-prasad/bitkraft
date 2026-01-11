/**
 * SPA Router
 * 
 * Handles client-side navigation without page reload.
 * Intercepts link clicks and fetches JSON payloads.
 */

class SPARouter {
  constructor(lifecycleManager) {
    this.lifecycleManager = lifecycleManager;
    this.currentRoute = null;
    this.isNavigating = false;
  }

  /**
   * Initialize the router
   */
  init() {
    // Get initial route from DOM
    const app = document.getElementById('app');
    this.currentRoute = app ? app.dataset.route : '/';
    
    // Intercept link clicks
    document.addEventListener('click', this.handleClick.bind(this));
    
    // Handle browser back/forward
    window.addEventListener('popstate', this.handlePopState.bind(this));
    
    console.log('[SPARouter] Initialized');
  }

  /**
   * Handle link clicks
   */
  handleClick(event) {
    // Check if it's a navigation link
    const link = event.target.closest('a');
    
    if (!link) return;
    
    // Check if it's an internal link
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;
    
    // Prevent default and navigate
    event.preventDefault();
    this.navigateTo(href);
  }

  /**
   * Handle browser back/forward buttons
   */
  handlePopState(event) {
    const path = window.location.pathname;
    this.navigateTo(path, false); // false = don't push to history
  }

  /**
   * Navigate to a new route
   */
  async navigateTo(path, pushState = true) {
    if (this.isNavigating) {
      console.log('[SPARouter] Navigation already in progress');
      return;
    }

    if (path === this.currentRoute) {
      console.log('[SPARouter] Already on route:', path);
      return;
    }

    console.log('[SPARouter] Navigating to:', path);
    this.isNavigating = true;

    try {
      // Fetch JSON payload
      const response = await fetch(path, {
        headers: {
          'X-BitkRaft-SPA': 'true',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Navigation failed: ${response.status}`);
      }

      const payload = await response.json();
      
      console.log('[SPARouter] Payload received:', payload);
      console.log('[SPARouter] HTML in payload:', !!payload.html);
      
      // Destroy current features
      await this.lifecycleManager.destroyCurrentFeatures();
      
      // Update DOM with new HTML first
      this.updateDOM(payload);
      
      // Update history
      if (pushState) {
        window.history.pushState({ path }, '', path);
      }
      
      // Initialize new features
      await this.lifecycleManager.initFeatures(payload.route.features, payload.data);
      
      // Update current route
      this.currentRoute = path;
      
      // Scroll to top
      window.scrollTo(0, 0);
      
      console.log('[SPARouter] Navigation complete');
    } catch (error) {
      console.error('[SPARouter] Navigation error:', error);
      // Fallback to full page load
      window.location.href = path;
    } finally {
      this.isNavigating = false;
    }
  }

  /**
   * Update DOM with new content
   */
  updateDOM(payload) {
    const app = document.getElementById('app');
    if (!app) {
      console.error('[SPARouter] #app element not found');
      return;
    }

    // Update meta tags
    if (payload.meta) {
      document.title = payload.meta.title || 'BitKraft Framework';
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && payload.meta.description) {
        metaDesc.setAttribute('content', payload.meta.description);
      }
    }

    // Replace page content with new HTML
    if (payload.html) {
      console.log('[SPARouter] Replacing HTML, length:', payload.html.length);
      app.innerHTML = payload.html;
      app.setAttribute('data-route', payload.route.path);
      
      // Verify the new elements are in the DOM
      const newElements = app.querySelectorAll('[data-feature]');
      console.log('[SPARouter] Features in new DOM:', Array.from(newElements).map(el => el.dataset.feature));
      
      console.log('[SPARouter] DOM updated with new HTML for route:', payload.route.path);
    } else {
      console.error('[SPARouter] No HTML in payload! Cannot update DOM.');
      console.error('[SPARouter] Payload:', payload);
    }
  }

  /**
   * Destroy router
   */
  destroy() {
    document.removeEventListener('click', this.handleClick);
    window.removeEventListener('popstate', this.handlePopState);
    console.log('[SPARouter] Destroyed');
  }
}

export default SPARouter;
