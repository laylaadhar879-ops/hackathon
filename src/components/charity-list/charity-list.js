/**
 * Charity Project Modal Component
 * Displays a modal with multiple GlobalGiving projects for user to choose from
 */

import * as bootstrap from 'bootstrap';
import { getDonationUrl, getFoodCharityProjects } from '../../services/globalgiving.js';
import { formatCurrencyFromLocation } from '../../services/currency.js';

/**
 * Create a charity selection modal HTML
 * @param {Object} charityData - Object containing projects array, totalFound, and currentStart
 * @param {Object} userLocation - User's location info
 * @param {Object} recipe - Recipe object from MealDB API
 * @param {number} mealValue - Estimated cost of the meal in EUR
 * @returns {string} HTML string for the charity modal
 */
export function createCharityModal(charityData, userLocation, recipe = null, mealValue = 20) {
  const projects = charityData?.projects || [];
  const totalFound = charityData?.totalFound || 0;
  const currentStart = charityData?.currentStart || 0;

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

  // Calculate next start position and check if there are more results
  const nextStart = currentStart + projects.length;
  const hasMore = nextStart < totalFound;
  const loadMoreDisplay = hasMore ? '' : 'style="display: none;"';

  return `
    <!-- Charity Selection Modal -->
    <div class="modal fade charity-modal" id="charityModal" tabindex="-1" aria-labelledby="charityModalLabel" aria-hidden="true"
         data-next-start="${nextStart}"
         data-total-found="${totalFound}"
         data-country-code="${userLocation?.countryCode || ''}"
         data-meal-value="${mealValue}">
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
            <div class="row g-3" id="charityProjectsContainer">
              ${projectCards}
            </div>
          </div>
          <div class="modal-footer">
            <small class="text-muted me-auto">
              Powered by <a href="https://www.globalgiving.org" target="_blank" rel="noopener noreferrer">GlobalGiving</a>
            </small>
            <button type="button" class="btn btn-primary" id="loadMoreCharities" ${loadMoreDisplay}>
              <span class="load-more-text">Load More</span>
              <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
            </button>
            <button type="button" class="btn btn-success" id="donateToSelectedCharity" disabled>
              <i class="bi bi-gift-fill"></i>
              Donate
            </button>
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
    image = {},
    imageLink = '',
    country = '',
    goal = 0,
    funding = 0,
    _source = 'global',
    _sourceCountry = '',
  } = project;

  const progressPercentage = goal > 0 ? Math.round((funding / goal) * 100) : 0;
  const location = country || _sourceCountry || 'Unknown';

  // Try to get a better quality image from the image object
  let projectImage = imageLink;
  if (image && image.imagelink && Array.isArray(image.imagelink)) {
    // Use original size for best quality
    const originalImage = image.imagelink.find(link => link.size === 'original');
    projectImage = originalImage?.url || imageLink;
  }

  // Truncate summary to 150 characters
  const truncatedSummary = summary && summary.length > 150
    ? summary.substring(0, 150) + '...'
    : summary || 'Support this important cause';

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
  `;
}

/**
 * Setup pagination and card selection for the charity modal
 * Call this after the modal HTML is inserted into the DOM
 * @param {Object} userLocation - User's location info for currency formatting
 */
export function setupCharityPagination(userLocation) {
  const modal = document.getElementById('charityModal');
  const loadMoreBtn = document.getElementById('loadMoreCharities');
  const donateBtn = document.getElementById('donateToSelectedCharity');
  const container = document.getElementById('charityProjectsContainer');

  if (!modal || !loadMoreBtn || !container || !donateBtn) {
    return;
  }

  let selectedProjectId = null;
  let selectedProjectTitle = '';

  // Handle card selection
  const handleCardClick = (event) => {
    const card = event.target.closest('.charity-project-card');
    if (!card) return;

    const projectId = card.dataset.projectId;

    // Remove selection from all cards
    container.querySelectorAll('.charity-project-card').forEach(c => {
      c.style.border = '';
      c.style.backgroundColor = '';
      c.style.transform = '';
      c.style.boxShadow = '';
      c.classList.remove('selected');
    });

    // Select this card
    card.style.border = '3px solid #198754';
    card.style.backgroundColor = '#f8f9fa';
    card.style.transform = 'translateY(-4px)';
    card.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.15)';
    card.classList.add('selected');

    selectedProjectId = projectId;
    selectedProjectTitle = card.querySelector('.charity-project-title').textContent;

    // Enable donate button
    donateBtn.disabled = false;
  };

  // Add click handler to existing cards
  container.addEventListener('click', handleCardClick);

  // Handle donate button click
  donateBtn.addEventListener('click', () => {
    if (!selectedProjectId) return;

    const mealValue = parseFloat(modal.dataset.mealValue);
    const donationUrl = getDonationUrl(selectedProjectId, mealValue);
    window.open(donationUrl, '_blank', 'noopener,noreferrer');

    // Reset modal state
    resetModalState();

    // Close the modal
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) {
      bootstrapModal.hide();
    }
  });

  // Function to reset modal state
  const resetModalState = () => {
    // Deselect all cards
    container.querySelectorAll('.charity-project-card').forEach(c => {
      c.style.border = '';
      c.style.backgroundColor = '';
      c.style.transform = '';
      c.style.boxShadow = '';
      c.classList.remove('selected');
    });

    // Reset selected project
    selectedProjectId = null;
    selectedProjectTitle = '';

    // Reset donate button
    donateBtn.disabled = true;

    // Remove all cards except first 10 (reset pagination)
    const allCards = container.querySelectorAll('.col-md-6');
    allCards.forEach((card, index) => {
      if (index >= 10) {
        card.remove();
      }
    });

    // Reset pagination state to initial values
    const initialStart = 10; // After first 10 items
    modal.dataset.nextStart = initialStart;

    // Show Load More button if there are more items
    const totalFound = parseInt(modal.dataset.totalFound, 10);
    if (initialStart < totalFound) {
      loadMoreBtn.style.display = '';
    }
  };

  // Handle Load More button
  loadMoreBtn.addEventListener('click', async () => {
    const nextStart = parseInt(modal.dataset.nextStart, 10);
    const totalFound = parseInt(modal.dataset.totalFound, 10);
    const countryCode = modal.dataset.countryCode;
    const mealValue = parseFloat(modal.dataset.mealValue);

    // Check if there are more results
    if (nextStart >= totalFound) {
      loadMoreBtn.style.display = 'none';
      return;
    }

    // Show loading state
    const loadMoreText = loadMoreBtn.querySelector('.load-more-text');
    const spinner = loadMoreBtn.querySelector('.spinner-border');
    loadMoreBtn.disabled = true;
    loadMoreText.textContent = 'Loading...';
    spinner.classList.remove('d-none');

    try {
      // Fetch next batch of projects using offset pagination (gets 10 projects per API limit)
      const charityData = await getFoodCharityProjects(countryCode, nextStart);

      if (charityData.projects && charityData.projects.length > 0) {
        // Create HTML for new projects
        const newProjectCards = charityData.projects
          .map(project => createProjectCard(project, userLocation, mealValue))
          .join('');

        // Append to container
        container.insertAdjacentHTML('beforeend', newProjectCards);

        // Update pagination data attributes
        const newNextStart = nextStart + charityData.projects.length;
        modal.dataset.nextStart = newNextStart;

        // Hide button if no more projects
        if (newNextStart >= totalFound) {
          loadMoreBtn.style.display = 'none';
        }
      } else {
        // No more projects
        loadMoreBtn.style.display = 'none';
      }
    } catch (error) {
      console.error('Error loading more charities:', error);
      loadMoreText.textContent = 'Error loading more';
    } finally {
      // Reset button state
      loadMoreBtn.disabled = false;
      loadMoreText.textContent = 'Load More';
      spinner.classList.add('d-none');
    }
  });
}
