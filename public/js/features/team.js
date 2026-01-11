/**
 * Team Feature
 * 
 * About page team section.
 * Demonstrates lifecycle contract.
 */

let state = {
  element: null,
  backButton: null,
  clickHandler: null
};

/**
 * Initialize team feature
 */
export async function init(context) {
  console.log('[Team] Initializing...');
  
  state.element = context.element;
  state.backButton = state.element.querySelector('.back-button');
  
  if (state.backButton) {
    // Create bound handler for cleanup
    state.clickHandler = handleBackClick.bind(null, context);
    state.backButton.addEventListener('click', state.clickHandler);
  }
  
  // Mark as initialized
  state.element.classList.add('feature-initialized');
  
  console.log('[Team] Initialized');
}

/**
 * Destroy team feature
 */
export async function destroy() {
  console.log('[Team] Destroying...');
  
  // Remove event listeners
  if (state.backButton && state.clickHandler) {
    state.backButton.removeEventListener('click', state.clickHandler);
  }
  
  // Clear references
  state.element = null;
  state.backButton = null;
  state.clickHandler = null;
  
  console.log('[Team] Destroyed');
}

/**
 * Handle back button click
 */
function handleBackClick(context, event) {
  console.log('[Team] Back button clicked');
  // Navigation is handled by router
}
