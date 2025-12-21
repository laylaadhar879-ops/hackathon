import './style.css'

// Fetch and display recipes
fetchRecipes()

async function fetchRecipes() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    const data = await response.json()

    const recipeList = document.querySelector('#recipe-list')
    // TODO: update pagination implementation 
    recipeList.innerHTML = data.meals.slice(0, 11).map(meal => `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-body">
            <h5 class="card-title">${meal.strMeal}</h5>
            <p class="card-text">${meal.strCategory}</p>
            <a href="/recipe-detail.html?id=${meal.idMeal}" class="btn btn-primary">View Recipe</a>
          </div>
        </div>
      </div>
    `).join('')
  } catch (error) {
    console.error('Error fetching recipes:', error)
    document.querySelector('#recipe-list').innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">Error loading recipes</div>
      </div>
    `
  }
}
