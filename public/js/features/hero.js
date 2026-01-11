/**
 * Hero Feature
 * 
 * Homepage hero section with CTA button.
 * Demonstrates lifecycle contract.
 */

let state = {
  element: null,
  ctaButton: null,
  clickHandler: null
};

/**
 * Initialize hero feature
 */
export async function init(context) {
  console.log('[Hero] Initializing...');
  
  state.element = context.element;
  state.ctaButton = state.element.querySelector('.cta-button');
  
  if (state.ctaButton) {
    // Create bound handler for cleanup
    state.clickHandler = handleCTAClick.bind(null, context);
    state.ctaButton.addEventListener('click', state.clickHandler);
  }
  
  // Mark as initialized (for testing)
  state.element.classList.add('feature-initialized');
  
  console.log('[Hero] Initialized');
}

/**
 * Destroy hero feature
 */
export async function destroy() {
  console.log('[Hero] Destroying...');
  
  // Remove event listeners
  if (state.ctaButton && state.clickHandler) {
    state.ctaButton.removeEventListener('click', state.clickHandler);
  }
  
  // Clear references
  state.element = null;
  state.ctaButton = null;
  state.clickHandler = null;
  
  console.log('[Hero] Destroyed');
}

/**
 * Handle CTA button click
 */
function handleCTAClick(context, event) {
  console.log('[Hero] CTA clicked');
  // Navigation is handled by router
}
