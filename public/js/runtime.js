import Router from './core/router.js';
import LifecycleManager from './core/lifecycle-manager.js';

class BitKraftRuntime {
  constructor() {
    this.lifecycleManager = null;
    this.router = null;
    this.initialState = null;
  }

  async init() {
    console.log('[BitKraft] Initializing runtime...');
    
    this.extractInitialState();
    
    this.lifecycleManager = new LifecycleManager();
    
    this.router = new Router(this.lifecycleManager);
    this.router.init();
    
    const app = document.getElementById('app');
    const currentRoute = app ? app.dataset.route : '/';
    
    const featureElements = document.querySelectorAll('[data-feature]');
    const featureNames = Array.from(featureElements).map(el => el.dataset.feature);
    
    await this.lifecycleManager.initFeatures(
      featureNames,
      this.initialState?.data || {}
    );
    
    console.log('[BitKraft] Runtime initialized');
    console.log('[BitKraft] Active features:', this.lifecycleManager.getActiveFeatureNames());
    
    if (typeof window !== 'undefined') {
      window.__BITKRAFT__ = {
        version: '1.0.0-alpha.1',
        phase: 1,
        lifecycleManager: this.lifecycleManager,
        router: this.router,
        getState: () => this.initialState
      };
    }
  }

  extractInitialState() {
    const stateElement = document.getElementById('__BITKRAFT_STATE__');
    
    if (stateElement) {
      try {
        this.initialState = JSON.parse(stateElement.textContent);
        console.log('[BitKraft] Initial state loaded');
      } catch (error) {
        console.error('[BitKraft] Failed to parse initial state:', error);
        this.initialState = {};
      }
    } else {
      console.warn('[BitKraft] No initial state found');
      this.initialState = {};
    }
  }
}

export default BitKraftRuntime;
