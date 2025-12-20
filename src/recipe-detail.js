import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

// Get recipe ID from URL parameters
const urlParams = new URLSearchParams(window.location.search)
const recipeId = urlParams.get('id')

if (recipeId) {
  fetchRecipeDetail(recipeId)
} else {
  document.querySelector('#recipe-detail').innerHTML = `
    <div class="alert alert-warning">No recipe ID provided</div>
    <a href="/" class="btn btn-primary">Back to Home</a>
  `
}

async function fetchRecipeDetail(id) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const data = await response.json()

    if (!data.meals) {
      throw new Error('Recipe not found')
    }

    const recipe = data.meals[0]

    document.querySelector('#recipe-detail').innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <img src="${recipe.strMealThumb}" class="img-fluid rounded" alt="${recipe.strMeal}">
        </div>
        <div class="col-md-6">
          <h1>${recipe.strMeal}</h1>
          <p class="lead">${recipe.strCategory} - ${recipe.strArea}</p>
          <h3>Instructions</h3>
          <p>${recipe.strInstructions}</p>
          <a href="/" class="btn btn-secondary">Back to Home</a>
        </div>
      </div>
    `
  } catch (error) {
    console.error('Error fetching recipe:', error)
    document.querySelector('#recipe-detail').innerHTML = `
      <div class="alert alert-danger">Error loading recipe</div>
      <a href="/" class="btn btn-primary">Back to Home</a>
    `
  }
}
