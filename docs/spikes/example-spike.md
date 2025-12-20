# Spike: Recipe API Options

**Author**: John Doe
**Date**: 2025-12-20
**Time Box**: 2 hours

## Question/Goal

What's the best way to fetch recipe data for our application? We need recipe information including ingredients, instructions, and images.

## Research

I investigated three options:

### Option 1: TheMealDB API
- **URL**: https://www.themealdb.com/api.php
- **Cost**: Free
- **Pros**:
  - Easy to use
  - No API key required for basic usage
  - Good recipe data with images
- **Cons**:
  - Limited to meal recipes (no desserts focus)
  - Rate limiting on free tier

### Option 2: Spoonacular API
- **URL**: https://spoonacular.com/food-api
- **Cost**: Free tier with 150 requests/day
- **Pros**:
  - Comprehensive recipe database
  - Nutrition information included
  - Recipe search and filters
- **Cons**:
  - Requires API key
  - Limited free tier

### Option 3: Edamam Recipe API
- **URL**: https://www.edamam.com/
- **Cost**: Free tier available
- **Pros**:
  - Large recipe database
  - Dietary filters
  - Nutrition data
- **Cons**:
  - API key required
  - Complex response structure

## Code Examples

### TheMealDB Example

```javascript
// Fetch a random recipe
async function getRandomRecipe() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  const data = await response.json()
  return data.meals[0]
}

// Search recipes by name
async function searchRecipes(query) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
  const data = await response.json()
  return data.meals
}
```

### Spoonacular Example

```javascript
const API_KEY = 'your-api-key'

async function searchRecipes(query) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${API_KEY}`
  )
  const data = await response.json()
  return data.results
}
```

## Testing Results

I tested TheMealDB and it works well:

- Response time: ~200ms
- Data quality: Good
- Easy to integrate with our current setup

## Recommendation

**Use TheMealDB API** for the following reasons:

1. **No authentication required**: Easier for team members to start working immediately
2. **Free tier is sufficient**: For hackathon purposes, unlimited free tier is perfect
3. **Simple response structure**: Easy to work with for beginners
4. **Good documentation**: Clear examples and API docs

If we need more advanced features later (nutrition data, complex filtering), we can migrate to Spoonacular.

## Resources

- [TheMealDB Documentation](https://www.themealdb.com/api.php)
- [Example API Response](https://www.themealdb.com/api/json/v1/1/random.php)
- [Spoonacular Docs](https://spoonacular.com/food-api/docs)

## Next Steps

1. Create a `src/services/recipeAPI.js` file with helper functions
2. Build the recipe detail page component
3. Add error handling for failed API calls
