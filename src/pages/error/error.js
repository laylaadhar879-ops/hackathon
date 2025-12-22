// Error page initialization
console.log('Error page loaded')

// Parse URL parameters to display custom error messages
const urlParams = new URLSearchParams(window.location.search)
const errorType = urlParams.get('type')
const errorMessage = urlParams.get('message')
const errorDetails = urlParams.get('details')

// Update error message based on type
const errorMessageElement = document.querySelector('#error-message')
const errorDetailsElement = document.querySelector('#error-details')
const errorDetailsText = document.querySelector('#error-details-text')

if (errorType || errorMessage) {
  let customMessage = ''

  switch (errorType) {
    case 'recipe-not-found':
      customMessage = 'The recipe you are looking for could not be found. It may have been removed or the ID is invalid.'
      break
    case 'api-error':
      customMessage = 'We are experiencing issues connecting to our recipe database. Please try again later.'
      break
    case 'network-error':
      customMessage = 'Network connection error. Please check your internet connection and try again.'
      break
    case 'donation-error':
      customMessage = 'Unable to load donation information. Please try again later.'
      break
    default:
      if (errorMessage) {
        customMessage = decodeURIComponent(errorMessage)
      }
  }

  if (customMessage) {
    errorMessageElement.innerHTML = `<p class="lead">${customMessage}</p>`
  }
}

// Display error details if provided
if (errorDetails) {
  errorDetailsElement.style.display = 'block'
  errorDetailsText.textContent = decodeURIComponent(errorDetails)
}

// Log error for debugging
console.log('Error details:', {
  type: errorType,
  message: errorMessage,
  details: errorDetails,
  url: window.location.href
})
