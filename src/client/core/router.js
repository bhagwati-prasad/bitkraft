class Router {
  constructor(lifecycleManager) {
    this.lifecycleManager = lifecycleManager;
    this.currentRoute = null;
    this.isNavigating = false;
  }

  init() {
    const app = document.getElementById('app');
    this.currentRoute = app ? app.dataset.route : '/';
    
    document.addEventListener('click', this.handleClick.bind(this));
    
    window.addEventListener('popstate', this.handlePopState.bind(this));
    
    console.log('[Router] Initialized');
  }

  handleClick(event) {
    const link = event.target.closest('a');
    
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;
    
    event.preventDefault();
    this.navigateTo(href);
  }

  handlePopState(event) {
    const path = window.location.pathname;
    this.navigateTo(path, false);
  }

  async navigateTo(path, pushState = true) {
    if (this.isNavigating) {
      console.log('[Router] Navigation already in progress');
      return;
    }

    if (path === this.currentRoute) {
      console.log('[Router] Already on route:', path);
      return;
    }

    console.log('[Router] Navigating to:', path);
    this.isNavigating = true;

    try {
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
      
      console.log('[Router] Payload received:', payload);
      console.log('[Router] HTML in payload:', !!payload.html);
      
      await this.lifecycleManager.destroyCurrentFeatures();
      
      this.updateDOM(payload);
      
      if (pushState) {
        window.history.pushState({ path }, '', path);
      }
      
      await this.lifecycleManager.initFeatures(payload.route.features, payload.data);
      
      this.currentRoute = path;
      
      window.scrollTo(0, 0);
      
      console.log('[Router] Navigation complete');
    } catch (error) {
      console.error('[Router] Navigation error:', error);
      window.location.href = path;
    } finally {
      this.isNavigating = false;
    }
  }

  updateDOM(payload) {
    const app = document.getElementById('app');
    if (!app) {
      console.error('[Router] #app element not found');
      return;
    }

    if (payload.meta) {
      document.title = payload.meta.title || 'BitKraft Framework';
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && payload.meta.description) {
        metaDesc.setAttribute('content', payload.meta.description);
      }
    }

    if (payload.html) {
      console.log('[Router] Replacing HTML, length:', payload.html.length);
      app.innerHTML = payload.html;
      app.setAttribute('data-route', payload.route.path);
      
      const newElements = app.querySelectorAll('[data-feature]');
      console.log('[Router] Features in new DOM:', Array.from(newElements).map(el => el.dataset.feature));
      
      console.log('[Router] DOM updated with new HTML for route:', payload.route.path);
    } else {
      console.error('[Router] No HTML in payload! Cannot update DOM.');
      console.error('[Router] Payload:', payload);
    }
  }

  destroy() {
    document.removeEventListener('click', this.handleClick);
    window.removeEventListener('popstate', this.handlePopState);
    console.log('[Router] Destroyed');
  }
}

export default Router;
