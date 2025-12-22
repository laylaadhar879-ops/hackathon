import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import './navbar.css'

// Initialize navbar toggler
initNavbarToggler()

// Fetch and display recipes
fetchRecipes()

function initNavbarToggler() {
  const navbarToggler = document.getElementById('navbarToggler')
  const navbarCollapse = document.getElementById('navbarNav')

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
      navbarCollapse.classList.toggle('show')
      const isExpanded = navbarCollapse.classList.contains('show')
      navbarToggler.setAttribute('aria-expanded', isExpanded)
    })

    // Close menu when a nav link is clicked
    const navLinks = navbarCollapse.querySelectorAll('.nav-link')
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbarCollapse.classList.remove('show')
        navbarToggler.setAttribute('aria-expanded', false)
      })
    })
  }
}

async function fetchRecipes() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    const data = await response.json()

    const recipeList = document.querySelector('#recipe-list')
    recipeList.innerHTML = data.meals.slice(0, 6).map(meal => `
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
