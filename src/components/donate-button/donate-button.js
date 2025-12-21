import './donate-button.css'

/**
 * Creates a donate button that opens the charity selection modal
 * @returns {string} The donate button HTML
 */
export function createDonateButton() {
  return `
    <button
      type="button"
      data-bs-toggle="modal"
      data-bs-target="#charityModal"
      class="donate-button btn btn-success"
    >
      <i class="bi bi-heart-fill"></i>
      Donate this meal
    </button>
  `
}

/**
 * Inserts the donate button into a specific element
 *
 * How to use:
 * 1. Import this function: import { insertDonateButton } from '../../components/donate-button/donate-button.js'
 * 2. Call it with a CSS selector: insertDonateButton('.card-body')
 * 3. The donate button will be added to the end of that element
 *
 * @param {string} selector - CSS selector for the container element (e.g., '#recipe-detail', '.card-body')
 *
 * How it works:
 * - Finds the element using document.querySelector(selector)
 * - Creates the donate button HTML using createDonateButton()
 * - Inserts it at the end of the element using insertAdjacentHTML('beforeend', html)
 * - 'beforeend' means: insert just before the closing tag of the element
 * - This adds the button after all existing content in the container
 */
export function insertDonateButton(selector) {
  const container = document.querySelector(selector)
  if (container) {
    const buttonHtml = createDonateButton()
    // insertAdjacentHTML inserts HTML at a specific position without replacing existing content
    // 'beforeend' = just before the closing tag of the element
    container.insertAdjacentHTML('beforeend', buttonHtml)
  }
}
