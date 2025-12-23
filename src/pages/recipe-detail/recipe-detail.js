import './style.css'
import '../../components/charity-list/charity-list.css'
import * as bootstrap from 'bootstrap'
import { createCharityModal, setupCharityPagination } from '../../components/charity-list/charity-list.js'
import { getUserLocation } from '../../services/location.js'
import { getFoodCharityProjects, estimateMealValue } from '../../services/globalgiving.js'
import { handleRecipeNotFound, handleAPIError, displayInlineError } from '../../utils/error-handler.js'
import { formatCurrencyFromLocation } from '../../services/currency.js'

// Get recipe ID from URL parameters
const urlParams = new URLSearchParams(window.location.search)
const recipeId = urlParams.get('id')

if (recipeId) {
  fetchRecipeDetail(recipeId)
} else {
  displayInlineError('recipe-detail', 'No recipe ID provided')
}

async function fetchRecipeDetail(id) {
  try {
    // Fetch recipe and user location in parallel
    const [recipeResponse, userLocation] = await Promise.all([
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`),
      getUserLocation(),
    ])

    const data = await recipeResponse.json()

    // Check if recipe exists - API returns null or empty array for invalid IDs
    if (!data.meals || data.meals.length === 0 || !data.meals[0]) {
      handleRecipeNotFound(id)
      return
    }

    const recipe = data.meals[0]

    // Validate that we have the minimum required data
    if (!recipe.strMeal || !recipe.strMealThumb) {
      handleRecipeNotFound(id)
      return
    }

    // Extract ingredients and measurements
    const ingredients = extractIngredients(recipe)
    const instructions = extractInstructions(recipe.strInstructions)

    // Render recipe with two-column layout
    document.querySelector('#recipe-detail').innerHTML = `
      <div class="row mb-4">
        <div class="col">
          <a href="/recipes.html" class="btn btn-outline-success mb-3">
            <i class="bi bi-arrow-left"></i> Back to Recipes
          </a>
        </div>
      </div>

      <div class="row">
        <!-- Main Content Column -->
        <div class="col-lg-8">
          <!-- Recipe Image -->
          <div class="mb-4">
            <img src="${recipe.strMealThumb}" class="img-fluid rounded" alt="${recipe.strMeal}" style="width: 100%; max-height: 400px; object-fit: cover;">
          </div>

          <!-- Recipe Title and Description -->
          <h1 class="mb-3">${recipe.strMeal}</h1>
          <p class="lead mb-4">${recipe.strCategory} - ${recipe.strArea} cuisine</p>

          <!-- Recipe Meta Info -->
          <div class="row mb-4">
            <div class="col-sm-4">
              <strong>Prep Time:</strong><br>
              <span class="text-muted">30 mins</span>
            </div>
            <div class="col-sm-4">
              <strong>Servings:</strong><br>
              <span class="text-muted">4</span>
            </div>
            <div class="col-sm-4">
              <strong>Difficulty:</strong><br>
              <span class="text-muted">Medium</span>
            </div>
          </div>

          <!-- Ingredients Section -->
          <h3 class="mb-3">Ingredients</h3>
          <ul class="list-group mb-4">
            ${ingredients.map(ingredient => `
              <li class="list-group-item">${ingredient}</li>
            `).join('')}
          </ul>

          <!-- Instructions Section -->
          <h3 class="mb-3">Instructions</h3>
          <ol class="list-group list-group-numbered mb-4">
            ${instructions.map(instruction => `
              <li class="list-group-item">${instruction}</li>
            `).join('')}
          </ol>
        </div>

        <!-- Donation Sidebar -->
        <div class="col-lg-4">
          <div class="border rounded p-4 bg-light position-sticky" style="top: 20px;">
            <h4 class="mb-3">Help Feed Someone</h4>
            <p class="mb-3">Your donation can provide this meal to a family in need.</p>
            <button type="button" id="donateModalButton" class="donate-button btn btn-success w-100">
              <i class="bi bi-heart-fill"></i>
              Donate This Meal
            </button>
            <p class="small text-muted mt-3 mb-0">
              Every donation helps us prepare and deliver meals to those who need them most.
            </p>
          </div>
        </div>
      </div>
    `

    // Calculate the estimated value of this meal in user's local currency
    const mealValue = estimateMealValue(recipe, userLocation)

    // Create loading modal immediately
    const loadingModalHtml = createLoadingModal()
    document.body.insertAdjacentHTML('beforeend', loadingModalHtml)

    // Setup donate button to open modal immediately
    requestAnimationFrame(() => {
      const donateButton = document.getElementById('donateModalButton')
      const charityModalElement = document.getElementById('charityModal')

      if (donateButton && charityModalElement) {
        // Initialize Bootstrap modal instance once, reuse it for all clicks
        const modal = new bootstrap.Modal(charityModalElement)

        donateButton.addEventListener('click', () => {
          modal.show()
        })
      }
    })

    // Fetch charity projects in the background (gets 10 projects per API limit)
    const charityData = await getFoodCharityProjects(userLocation.countryCode, 0)

    // Update modal with charity data
    updateModalWithCharityData(charityData, userLocation, recipe, mealValue)

    // Setup pagination for the charity modal
    setupCharityPagination(userLocation)

  } catch (error) {
    // Handle network errors vs API errors
    if (error.message.includes('fetch') || error.name === 'TypeError') {
      handleAPIError(error, 'Failed to fetch recipe data')
    } else {
      displayInlineError('recipe-detail', 'Error loading recipe. Please try again.')
    }
  }
}

/**
 * Create a loading modal while charity data is being fetched
 * @returns {string} HTML string for the loading modal
 */
function createLoadingModal() {
  return `
    <!-- Charity Selection Modal (Loading) -->
    <div class="modal fade charity-modal" id="charityModal" tabindex="-1" aria-labelledby="charityModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="charityModalLabel">
              <i class="bi bi-heart-fill"></i> Donate the Cost of Your Meal
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center py-5" id="charityModalBody">
            <div class="spinner-border text-success mb-3" role="status" style="width: 3rem; height: 3rem;">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted">Loading charity projects...</p>
          </div>
          <div class="modal-footer" id="charityModalFooter">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Update modal content with charity data
 * @param {Object} charityData - Charity data from GlobalGiving API
 * @param {Object} userLocation - User's location info
 * @param {Object} recipe - Recipe object from MealDB API
 * @param {number} mealValue - Estimated cost of the meal
 */
function updateModalWithCharityData(charityData, userLocation, recipe, mealValue) {
  const modal = document.getElementById('charityModal')
  if (!modal) return

  const projects = charityData?.projects || []
  const totalFound = charityData?.totalFound || 0
  const currentStart = charityData?.currentStart || 0

  // Update modal data attributes
  const nextStart = currentStart + projects.length
  const hasMore = nextStart < totalFound

  modal.dataset.nextStart = nextStart
  modal.dataset.totalFound = totalFound
  modal.dataset.countryCode = userLocation?.countryCode || ''
  modal.dataset.mealValue = mealValue

  // Update modal body
  const modalBody = document.getElementById('charityModalBody')
  const modalFooter = document.getElementById('charityModalFooter')

  if (!modalBody || !modalFooter) return

  if (projects.length === 0) {
    modalBody.innerHTML = `
      <div class="alert alert-info">
        <i class="bi bi-info-circle"></i>
        Unable to load charity projects at this time.
        Please visit <a href="https://www.globalgiving.org/search/?size=25&nextPage=1&sortField=sortorder&selectedCountries=&loadAllResults=true&theme=food" target="_blank" rel="noopener noreferrer">GlobalGiving</a>
        to find food security projects to support.
      </div>
    `
    modalFooter.innerHTML = `
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
    `
    return
  }

  const recipeName = recipe?.strMeal || 'this meal'
  const formattedAmount = formatCurrencyFromLocation(mealValue, userLocation)
  const mealDescription = recipe
    ? `You're viewing <strong>${recipeName}</strong>, which costs approximately <strong>${formattedAmount}</strong> to make.`
    : ``

  const projectCards = projects.map(project => {
    const {
      id,
      title,
      summary,
      organization = {},
      image = {},
      imageLink = '',
      country = '',
      goal = 0,
      funding = 0,
    } = project

    const progressPercentage = goal > 0 ? Math.round((funding / goal) * 100) : 0
    const location = country || 'Unknown'

    let projectImage = imageLink
    if (image && image.imagelink && Array.isArray(image.imagelink)) {
      const originalImage = image.imagelink.find(link => link.size === 'original')
      projectImage = originalImage?.url || imageLink
    }

    const truncatedSummary = summary && summary.length > 150
      ? summary.substring(0, 150) + '...'
      : summary || 'Support this important cause'

    return `
      <div class="col-md-6 col-lg-4">
        <div class="card charity-project-card h-100 shadow-sm"
             data-project-id="${id}"
             style="cursor: pointer; transition: all 0.2s;"
             role="button"
             tabindex="0"
             onmouseenter="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 0.5rem 1rem rgba(0,0,0,0.15)';"
             onmouseleave="if(!this.classList.contains('selected')) { this.style.transform=''; this.style.boxShadow=''; }">
          ${projectImage ? `
            <img src="${projectImage}" class="card-img-top charity-project-image" alt="${title}" style="height: 200px; object-fit: cover;">
          ` : ''}
          <div class="card-body d-flex flex-column">
            <h6 class="card-title charity-project-title">${title}</h6>
            <p class="text-muted mb-2">
              <small>
                <i class="bi bi-building"></i> ${organization.name || 'Organization'}
                <br>
                <i class="bi bi-geo-alt"></i> ${location}
              </small>
            </p>
            <p class="card-text charity-project-summary flex-grow-1">${truncatedSummary}</p>

            ${goal > 0 ? `
              <div class="mb-2">
                <div class="progress" style="height: 6px;">
                  <div
                    class="progress-bar bg-success"
                    role="progressbar"
                    style="width: ${progressPercentage}%"
                    aria-valuenow="${progressPercentage}"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div class="d-flex justify-content-between mt-1">
                  <small class="text-muted">${progressPercentage}% funded</small>
                  <small class="text-muted">$${funding.toLocaleString()} / $${goal.toLocaleString()}</small>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `
  }).join('')

  modalBody.innerHTML = `
    <p class="text-muted mb-4">
      ${mealDescription}
      Select a food/hunger charity to donate <strong>${formattedAmount}</strong> to. These projects are fighting hunger and food insecurity around the world.
      Your contribution makes a real difference!
    </p>
    <div class="row g-3" id="charityProjectsContainer">
      ${projectCards}
    </div>
  `

  const loadMoreDisplay = hasMore ? '' : 'style="display: none;"'
  modalFooter.innerHTML = `
    <small class="text-muted me-auto">
      Powered by <a href="https://www.globalgiving.org" target="_blank" rel="noopener noreferrer">GlobalGiving</a>
    </small>
    <button type="button" class="btn btn-outline-success" id="loadMoreCharities" ${loadMoreDisplay}>
      <span class="load-more-text">Load More</span>
      <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
    </button>
    <button type="button" class="btn btn-success" id="donateToSelectedCharity" disabled>
      <i class="bi bi-gift-fill"></i>
      Donate
    </button>
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
  `
}

/**
 * Extract ingredients from recipe object
 * @param {Object} recipe - Recipe data from MealDB API
 * @returns {Array} Array of ingredient strings
 */
function extractIngredients(recipe) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]
    const measure = recipe[`strMeasure${i}`]

    if (ingredient && ingredient.trim()) {
      const ingredientText = measure && measure.trim()
        ? `${measure.trim()} ${ingredient.trim()}`
        : ingredient.trim()
      ingredients.push(ingredientText)
    }
  }
  return ingredients
}

/**
 * Extract and clean up instructions from recipe
 * @param {string} instructionsText - Raw instructions text from MealDB API
 * @returns {Array} Array of cleaned instruction strings
 */
function extractInstructions(instructionsText) {
  if (!instructionsText) return []

  // Split by double newlines (handles both \r\n\r\n and \n\n)
  const steps = instructionsText
    .split(/\r\n\r\n|\n\n/)
    .map(step => step.trim())
    .filter(step => step.length > 0)

  // Clean up step labels (STEP 1, step 1, or just numbers)
  return steps.map(step => {
    // Remove patterns like "STEP 1", "step 1", "1", "2", etc. at the start
    return step
      .replace(/^(STEP\s+\d+|step\s+\d+|\d+)\s*\r?\n?/i, '')
      .trim()
  }).filter(step => step.length > 0)
}
