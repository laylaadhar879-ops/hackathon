import './style.css'
import '../../components/charity-list/charity-list.css'
import * as bootstrap from 'bootstrap'
import { createDonateButton } from '../../components/donate-button/donate-button.js'
import { createCharityModal, setupCharityPagination } from '../../components/charity-list/charity-list.js'
import { getUserLocation } from '../../services/location.js'
import { getFoodCharityProjects, estimateMealValue } from '../../services/globalgiving.js'

// Get recipe ID from URL parameters
const urlParams = new URLSearchParams(window.location.search)
const recipeId = urlParams.get('id')

if (recipeId) {
  fetchRecipeDetail(recipeId)
} else {
  document.querySelector('#recipe-detail').innerHTML = `
    <div class="alert alert-warning">No recipe ID provided</div>
    <a href="/recipes.html" class="btn btn-primary">Back to Recipes</a>
  `
}

async function fetchRecipeDetail(id) {
  try {
    // Fetch recipe and user location in parallel
    const [recipeResponse, userLocation] = await Promise.all([
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`),
      getUserLocation(),
    ])

    const data = await recipeResponse.json()

    if (!data.meals) {
      throw new Error('Recipe not found')
    }

    const recipe = data.meals[0]

    // Extract ingredients and measurements
    const ingredients = extractIngredients(recipe)
    const instructions = extractInstructions(recipe.strInstructions)

    // Render recipe with two-column layout
    document.querySelector('#recipe-detail').innerHTML = `
      <div class="row mb-4">
        <div class="col">
          <a href="/recipes.html" class="btn btn-outline-secondary mb-3">
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
            ${createDonateButton()}
            <p class="small text-muted mt-3 mb-0">
              Every donation helps us prepare and deliver meals to those who need them most.
            </p>
          </div>
        </div>
      </div>
    `

    // Fetch charity projects in the background (gets 10 projects per API limit)
    const charityData = await getFoodCharityProjects(userLocation.countryCode, 0)

    // Calculate the estimated value of this meal in user's local currency
    const mealValue = estimateMealValue(recipe, userLocation)

    // Add the charity modal to the page with recipe and meal value
    const modalHtml = createCharityModal(charityData, userLocation, recipe, mealValue)
    document.body.insertAdjacentHTML('beforeend', modalHtml)

    // Setup pagination for the charity modal
    setupCharityPagination(userLocation)

  } catch (error) {
    console.error('Error fetching recipe:', error)
    document.querySelector('#recipe-detail').innerHTML = `
      <div class="alert alert-danger">Error loading recipe</div>
      <a href="/recipes.html" class="btn btn-primary">Back to Recipes</a>
    `
  }
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
