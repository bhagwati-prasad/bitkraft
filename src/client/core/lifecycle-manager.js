class LifecycleManager {
  constructor() {
    this.activeFeatures = new Map();
  }

  async initFeatures(featureNames, data) {
    console.log('[LifecycleManager] Initializing features:', featureNames);
    
    for (const featureName of featureNames) {
      try {
        const featureModule = await import(`/public/js/features/${featureName}.js`);
        
        const element = document.querySelector(`[data-feature="${featureName}"]`);
        
        if (!element) {
          console.warn(`[LifecycleManager] Element not found for feature: ${featureName}`);
          continue;
        }
        
        const context = {
          element,
          data,
          route: window.location.pathname
        };
        
        if (typeof featureModule.init === 'function') {
          await featureModule.init(context);
          
          this.activeFeatures.set(featureName, {
            module: featureModule,
            element,
            context
          });
          
          console.log(`[LifecycleManager] Feature initialized: ${featureName}`);
        } else {
          console.warn(`[LifecycleManager] Feature ${featureName} has no init() function`);
        }
      } catch (error) {
        console.error(`[LifecycleManager] Failed to initialize feature ${featureName}:`, error);
      }
    }
  }

  async destroyCurrentFeatures() {
    console.log('[LifecycleManager] Destroying active features');
    
    const features = Array.from(this.activeFeatures.entries());
    
    for (const [featureName, featureData] of features) {
      try {
        const { module } = featureData;
        
        if (typeof module.destroy === 'function') {
          await module.destroy();
          console.log(`[LifecycleManager] Feature destroyed: ${featureName}`);
        } else {
          console.warn(`[LifecycleManager] Feature ${featureName} has no destroy() function`);
        }
      } catch (error) {
        console.error(`[LifecycleManager] Failed to destroy feature ${featureName}:`, error);
      }
    }
    
    this.activeFeatures.clear();
  }

  getActiveFeatureCount() {
    return this.activeFeatures.size;
  }

  getActiveFeatureNames() {
    return Array.from(this.activeFeatures.keys());
  }
}

export default LifecycleManager;
