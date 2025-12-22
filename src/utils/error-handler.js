/**
 * Error handling utility for consistent error page redirects
 */

/**
 * Redirect to the error page with custom parameters
 * @param {Object} options - Error configuration
 * @param {string} options.type - Error type (recipe-not-found, api-error, network-error, donation-error)
 * @param {string} [options.message] - Custom error message
 * @param {string} [options.details] - Error details for debugging
 */
export function redirectToError({ type, message, details }) {
  const params = new URLSearchParams()

  if (type) {
    params.append('type', type)
  }

  if (message) {
    params.append('message', encodeURIComponent(message))
  }

  if (details) {
    params.append('details', encodeURIComponent(details))
  }

  window.location.href = `/error.html?${params.toString()}`
}

/**
 * Redirect to 404 page
 */
export function redirectTo404() {
  window.location.href = '/404.html'
}

/**
 * Handle recipe not found error
 * @param {string} recipeId - The recipe ID that was not found
 */
export function handleRecipeNotFound(recipeId) {
  redirectToError({
    type: 'recipe-not-found',
    details: `Recipe ID: ${recipeId}`
  })
}

/**
 * Handle API error
 * @param {Error} error - The error object
 * @param {string} [context] - Additional context about where the error occurred
 */
export function handleAPIError(error, context = '') {
  console.error('API Error:', error)

  redirectToError({
    type: 'api-error',
    details: context ? `${context}: ${error.message}` : error.message
  })
}

/**
 * Handle network error
 * @param {Error} error - The error object
 */
export function handleNetworkError(error) {
  console.error('Network Error:', error)

  redirectToError({
    type: 'network-error',
    details: error.message
  })
}

/**
 * Handle donation-related errors
 * @param {Error} error - The error object
 */
export function handleDonationError(error) {
  console.error('Donation Error:', error)

  redirectToError({
    type: 'donation-error',
    details: error.message
  })
}

/**
 * Display inline error message in a container
 * @param {string} containerId - The ID of the container element
 * @param {string} message - Error message to display
 * @param {Object} [options] - Display options
 * @param {string} [options.backLink] - URL for the back button
 * @param {string} [options.backText] - Text for the back button
 */
export function displayInlineError(containerId, message, options = {}) {
  const container = document.querySelector(`#${containerId}`)

  if (!container) {
    console.error(`Container #${containerId} not found`)
    return
  }

  const backLink = options.backLink || '/recipes.html'
  const backText = options.backText || 'Back to Recipes'

  container.innerHTML = `
    <div class="alert alert-danger" role="alert">
      <h4 class="alert-heading">Error</h4>
      <p>${message}</p>
    </div>
    <a href="${backLink}" class="btn btn-primary">${backText}</a>
  `
}
