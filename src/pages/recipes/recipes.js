import './style.css'
import 'bootstrap'

// State management
let allRecipes = []
let displayedRecipes = []
let recipesPerPage = 6
let currentPage = 1
let currentCategory = '' // Store the current filter category
let currentArea = '' // Store the current filter area

// Initialize the page
init()

// Get seasonal search term based on current date
function getSeasonalSearchTerm() {
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12
  const day = now.getDate()

  // December: Christmas
  if (month === 12) {
    return { term: 'christmas', label: 'Christmas Recipes' }
  }
  // November: Thanksgiving
  if (month === 11) {
    return { term: 'turkey', label: 'Thanksgiving Recipes' }
  }
  // October: Halloween
  if (month === 10) {
    return { term: 'pumpkin', label: 'Halloween & Autumn Recipes' }
  }
  // February: Valentine's Day
  if (month === 2 && day <= 14) {
    return { term: 'chocolate', label: "Valentine's Day Treats" }
  }
  // March-April: Easter/Spring
  if (month === 3 || month === 4) {
    return { term: 'lamb', label: 'Spring & Easter Recipes' }
  }
  // June-August: Summer
  if (month >= 6 && month <= 8) {
    return { term: 'seafood', label: 'Summer Recipes' }
  }
  // September: Back to school (quick meals)
  if (month === 9) {
    return { term: 'chicken', label: 'Quick Weeknight Meals' }
  }
  // Default: popular recipes
  return { term: '', label: 'Popular Recipes' }
}

async function init() {
  await loadFilters()
  const seasonal = getSeasonalSearchTerm()
  await fetchRecipes(seasonal.term)
  setupEventListeners()
}

// Load filter options (categories and areas)
async function loadFilters() {
  try {
    // Fetch categories
    const categoriesResponse = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
    const categoriesData = await categoriesResponse.json()

    const categorySelect = document.querySelector('#category-filter')
    categoriesData.meals.forEach(cat => {
      const option = document.createElement('option')
      option.value = cat.strCategory
      option.textContent = cat.strCategory
      categorySelect.appendChild(option)
    })

    // Fetch areas
    const areasResponse = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
    const areasData = await areasResponse.json()

    const areaSelect = document.querySelector('#area-filter')
    areasData.meals.forEach(area => {
      const option = document.createElement('option')
      option.value = area.strArea
      option.textContent = area.strArea
      areaSelect.appendChild(option)
    })
  } catch (error) {
    console.error('Error loading filters:', error)
  }
}

// Fetch recipes from API
async function fetchRecipes(searchTerm = '') {
  try {
    const recipeList = document.querySelector('#recipe-list')
    recipeList.innerHTML = '<div class="col-12"><p>Loading recipes...</p></div>'

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
    const data = await response.json()

    if (data.meals) {
      allRecipes = data.meals
      currentPage = 1
      currentCategory = '' // Reset filters
      currentArea = ''
      displayRecipes()
    } else {
      recipeList.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info">No recipes found. Try a different search!</div>
        </div>
      `
      document.querySelector('#load-more-container').style.display = 'none'
    }
  } catch (error) {
    console.error('Error fetching recipes:', error)
    document.querySelector('#recipe-list').innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">Error loading recipes</div>
      </div>
    `
  }
}

// Fetch recipes by category
async function fetchRecipesByCategory(category) {
  try {
    const recipeList = document.querySelector('#recipe-list')
    recipeList.innerHTML = '<div class="col-12"><p>Loading recipes...</p></div>'

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    const data = await response.json()

    if (data.meals) {
      allRecipes = data.meals
      currentPage = 1
      currentCategory = category // Store the selected category
      currentArea = '' // Clear area filter
      displayRecipes()
    } else {
      recipeList.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info">No recipes found in this category.</div>
        </div>
      `
      document.querySelector('#load-more-container').style.display = 'none'
    }
  } catch (error) {
    console.error('Error fetching recipes:', error)
  }
}

// Fetch recipes by area
async function fetchRecipesByArea(area) {
  try {
    const recipeList = document.querySelector('#recipe-list')
    recipeList.innerHTML = '<div class="col-12"><p>Loading recipes...</p></div>'

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    const data = await response.json()

    if (data.meals) {
      allRecipes = data.meals
      currentPage = 1
      currentCategory = '' // Clear category filter
      currentArea = area // Store the selected area
      displayRecipes()
    } else {
      recipeList.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info">No recipes found for this cuisine.</div>
        </div>
      `
      document.querySelector('#load-more-container').style.display = 'none'
    }
  } catch (error) {
    console.error('Error fetching recipes:', error)
  }
}

// Display recipes with pagination
function displayRecipes() {
  const recipeList = document.querySelector('#recipe-list')
  const loadMoreContainer = document.querySelector('#load-more-container')

  // Calculate recipes to show
  const startIndex = 0
  const endIndex = currentPage * recipesPerPage
  displayedRecipes = allRecipes.slice(startIndex, endIndex)

  // Render recipe cards
  recipeList.innerHTML = displayedRecipes.map(meal => createRecipeCard(meal)).join('')

  // Add click handlers to make cards clickable
  document.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking the button directly
      if (!e.target.closest('.recipe-btn')) {
        const recipeId = card.dataset.recipeId
        window.location.href = `/recipe-detail.html?id=${recipeId}`
      }
    })
  })

  // Show/hide load more button
  if (endIndex < allRecipes.length) {
    loadMoreContainer.style.display = 'block'
  } else {
    loadMoreContainer.style.display = 'none'
  }
}

// Create a recipe card HTML
function createRecipeCard(meal) {
  // Handle both full meal objects and filtered meal objects (which have less data)
  const category = meal.strCategory || currentCategory
  const area = meal.strArea || currentArea
  
  // Determine what to show in the badge
  // If we have a category, use it. If we're filtering by area only, use the area
  const badgeText = category || (currentArea && !currentCategory ? currentArea : 'Recipe')
  
  // Create description based on available info
  let description = 'Delicious recipe'
  if (category) {
    description = `${category} cuisine`
  } else if (currentArea) {
    description = `${currentArea} cuisine`
  }
  
  // Only show the area field if we have area info AND we're not already showing it in the badge
  const showAreaField = area && !(currentArea && !currentCategory)

  return `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 recipe-card" data-recipe-id="${meal.idMeal}">
        <div class="recipe-image-container border-bottom bg-light">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="recipe-category-badge">${badgeText}</div>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${meal.strMeal}</h5>
          <p class="card-text flex-grow-1">${description}</p>
          ${showAreaField ? `
          <div class="mb-3">
            <small class="text-muted">
              <strong>Area:</strong> ${area}
            </small>
          </div>
          ` : ''}
          <a href="/recipe-detail.html?id=${meal.idMeal}" class="btn btn-success recipe-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book-fill me-2" viewBox="0 0 16 16">
              <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
            </svg>
            View Recipe
          </a>
        </div>
      </div>
    </div>
  `
}

// Setup event listeners
function setupEventListeners() {
  const seasonal = getSeasonalSearchTerm()

  // Load More button
  document.querySelector('#load-more-btn').addEventListener('click', () => {
    currentPage++
    displayRecipes()
  })

  // Search input
  const searchInput = document.querySelector('#search-input')
  searchInput.value = seasonal.term // Pre-fill with seasonal search
  searchInput.placeholder = `Search recipes... (try "${seasonal.term}")`

  let searchTimeout
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      fetchRecipes(e.target.value)
    }, 500) // Debounce search
  })

  // Category filter
  document.querySelector('#category-filter').addEventListener('change', (e) => {
    if (e.target.value) {
      // Clear other filters
      document.querySelector('#area-filter').value = ''
      document.querySelector('#search-input').value = ''
      fetchRecipesByCategory(e.target.value)
    }
  })

  // Area filter
  document.querySelector('#area-filter').addEventListener('change', (e) => {
    if (e.target.value) {
      // Clear other filters
      document.querySelector('#category-filter').value = ''
      document.querySelector('#search-input').value = ''
      fetchRecipesByArea(e.target.value)
    }
  })

  // Reset filters
  document.querySelector('#reset-filters').addEventListener('click', () => {
    const seasonalReset = getSeasonalSearchTerm()
    document.querySelector('#search-input').value = seasonalReset.term
    document.querySelector('#category-filter').value = ''
    document.querySelector('#area-filter').value = ''
    fetchRecipes(seasonalReset.term)
  })
}
