/**
 * GlobalGiving API service
 * Documentation: https://www.globalgiving.org/api/
 */

import { convertFromEUR } from './currency.js';

// API key is loaded from environment variable (.env file)
// Get your free API key from https://www.globalgiving.org/dy/v2/user/api/
// Add it to your .env file as: VITE_GLOBALGIVING_API_KEY=your_key_here
const API_KEY = import.meta.env.VITE_GLOBALGIVING_API_KEY;

/**
 * Fetch multiple food/hunger-related charity projects for user to choose from
 * Uses the search API which automatically filters out inactive projects
 * Search API uses offset pagination with &start parameter
 * Returns maximum 10 projects per request (API limit)
 * @param {string} countryCode - ISO 2-letter country code (not used in simple version)
 * @param {number} start - Offset for pagination (default: 0)
 * @returns {Promise<Object>} - Object containing projects array and pagination info
 */
export async function getFoodCharityProjects(countryCode, start = 0) {
  try {
    // Use the search endpoint with theme filter
    // Note: Search API automatically returns only active projects (active = true)
    // Using q=* to get all projects that match the theme filter
    // API returns max 10 results per request
    const url = `https://api.globalgiving.org/api/public/services/search/projects?api_key=${API_KEY}&q=*&filter=theme:hunger&start=${start}`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      return { projects: [], totalFound: 0, currentStart: start };
    }

    const data = await response.json();

    if (data.search && data.search.response && data.search.response.projects && data.search.response.projects.project) {
      let projects = Array.isArray(data.search.response.projects.project)
        ? data.search.response.projects.project
        : [data.search.response.projects.project];

      // Filter out any inactive projects (extra safety, though search should only return active)
      projects = projects.filter(p => p.active === true || p.status === 'active');

      // Tag all as global
      projects.forEach(p => {
        p._source = 'global';
        p._sourceCountry = p.country || p.iso3166CountryCode || 'Unknown';
      });

      // Get total number of results from response
      const totalFound = data.search.response.numberFound || 0;

      // Return all projects from API (max 10) with offset-based pagination info
      return {
        projects: projects,
        totalFound: totalFound,
        currentStart: start,
      };
    }

    return { projects: [], totalFound: 0, currentStart: start };

  } catch (error) {
    console.error('Error fetching charity projects:', error);
    return { projects: [], totalFound: 0, currentStart: start };
  }
}

/**
 * Estimate the cost of a meal based on recipe category
 * Returns the base value in EUR, which should be converted to user's currency
 * @param {Object} recipe - Recipe object from MealDB API
 * @param {Object} userLocation - User location object with currency info (optional)
 * @returns {number} - Estimated meal cost in user's currency (or EUR if no location provided)
 */
export function estimateMealValue(recipe, userLocation = null) {
  const category = recipe?.strCategory?.toLowerCase() || '';

  // Meal value estimates based on recipe category (in EUR - base currency)
  // update this with a more robust calculato in the future, this is fine for mvp
  const categoryValuesEUR = {
    // Lower cost meals
    'pasta': 8,
    'vegetarian': 10,
    'vegan': 10,
    'breakfast': 10,
    'side': 8,
    'dessert': 12,

    // Medium cost meals
    'chicken': 15,
    'pork': 18,
    'goat': 18,

    // Higher cost meals
    'beef': 25,
    'lamb': 28,
    'seafood': 30,

    // Default
    'default': 15
  };

  const eurValue = categoryValuesEUR[category] || categoryValuesEUR.default;

  // Convert to user's currency if location is provided
  if (userLocation && userLocation.currency) {
    return convertFromEUR(eurValue, userLocation.currency);
  }

  return eurValue;
}

/**
 * Get the donation URL for a project with pre-filled amount
 * Uses GlobalGiving's cart URL format for direct checkout
 * @param {number} projectId - The GlobalGiving project ID
 * @param {number} amount - Donation amount in EUR (minimum €5)
 * @returns {string} - The donation cart URL
 */
export function getDonationUrl(projectId, amount = 20) {
  // Ensure minimum donation amount of €5
  const finalAmount = Math.max(amount, 5);

  // Use the cart URL format for direct checkout
  // GlobalGiving handles currency display based on user's location
  return `https://www.globalgiving.org/dy/cart/view/gg.html?cmd=addItem&projid=${projectId}&frequency=ONCE&amount=${finalAmount}`;
}
