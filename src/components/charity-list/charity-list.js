/**
 * Charity Project Modal Component
 * Displays a modal with multiple GlobalGiving projects for user to choose from
 */

import { getDonationUrl } from '../../services/globalgiving.js';
import { formatCurrencyFromLocation } from '../../services/currency.js';

/**
 * Create a charity selection modal HTML
 * @param {Array} projects - Array of GlobalGiving project data
 * @param {Object} userLocation - User's location info
 * @param {Object} recipe - Recipe object from MealDB API
 * @param {number} mealValue - Estimated cost of the meal in EUR
 * @returns {string} HTML string for the charity modal
 */
export function createCharityModal(projects, userLocation, recipe = null, mealValue = 20) {
  if (!projects || projects.length === 0) {
    return `
      <!-- Charity Selection Modal -->
      <div class="modal fade charity-modal" id="charityModal" tabindex="-1" aria-labelledby="charityModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="charityModalLabel">
                <i class="bi bi-heart-fill"></i> Choose a Charity
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="alert alert-info">
                <i class="bi bi-info-circle"></i>
                Unable to load charity projects at this time.
                Please visit <a href="https://www.globalgiving.org/search/?size=25&nextPage=1&sortField=sortorder&selectedCountries=&loadAllResults=true&theme=food" target="_blank" rel="noopener noreferrer">GlobalGiving</a>
                to find food security projects to support.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const projectCards = projects.map(project => createProjectCard(project, userLocation, mealValue)).join('');

  const recipeName = recipe?.strMeal || 'this meal';
  const formattedAmount = formatCurrencyFromLocation(mealValue, userLocation);
  const mealDescription = recipe
    ? `You're viewing <strong>${recipeName}</strong>, which costs approximately <strong>${formattedAmount}</strong> to make.`
    : ``;

  return `
    <!-- Charity Selection Modal -->
    <div class="modal fade charity-modal" id="charityModal" tabindex="-1" aria-labelledby="charityModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="charityModalLabel">
              <i class="bi bi-heart-fill"></i> Donate the Cost of Your Meal
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted mb-4">
              ${mealDescription}
              Select a food/hunger charity to donate <strong>${formattedAmount}</strong> to. These projects are fighting hunger and food insecurity around the world.
              Your contribution makes a real difference!
            </p>
            <div class="row g-3">
              ${projectCards}
            </div>
          </div>
          <div class="modal-footer">
            <small class="text-muted me-auto">
              Powered by <a href="https://www.globalgiving.org" target="_blank" rel="noopener noreferrer">GlobalGiving</a>
            </small>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Create a single project card
 * @param {Object} project - GlobalGiving project data
 * @param {Object} userLocation - User's location info
 * @param {number} mealValue - Estimated cost of the meal in user's currency
 * @returns {string} HTML string for a single project card
 */
function createProjectCard(project, userLocation, mealValue = 20) {
  const {
    id,
    title,
    summary,
    organization = {},
    imageLink = '',
    country = '',
    goal = 0,
    funding = 0,
    _source = 'global',
    _sourceCountry = '',
  } = project;

  const donationUrl = getDonationUrl(id, mealValue);
  const formattedAmount = formatCurrencyFromLocation(mealValue, userLocation);
  const progressPercentage = goal > 0 ? Math.round((funding / goal) * 100) : 0;
  const location = country || _sourceCountry || 'Unknown';

  // Simple badge showing it's a hunger/food security project
  const themeBadge = `<span class="badge bg-success"><i class="bi bi-heart-fill"></i> Food Security</span>`;

  // Truncate summary to 150 characters
  const truncatedSummary = summary && summary.length > 150
    ? summary.substring(0, 150) + '...'
    : summary || 'Support this important cause';

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card charity-project-card h-100 shadow-sm">
        ${imageLink ? `
          <img src="${imageLink}" class="card-img-top charity-project-image" alt="${title}">
        ` : ''}
        <div class="card-body d-flex flex-column">
          <div class="mb-2">
            ${themeBadge}
          </div>
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
            <div class="mb-3">
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

          <a
            href="${donationUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-success w-100 mt-auto"
          >
            <i class="bi bi-gift-fill"></i>
            Donate ${formattedAmount}
          </a>
        </div>
      </div>
    </div>
  `;
}
