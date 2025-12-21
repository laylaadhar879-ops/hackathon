/**
 * Charity Project Card Component
 * Displays a GlobalGiving project with donation option
 */

import { getDonationUrl } from '../../services/globalgiving.js';

/**
 * Create a charity project card HTML
 * @param {Object} project - GlobalGiving project data
 * @param {string} userLocation - User's location info
 * @returns {string} HTML string for the charity card
 */
export function createCharityCard(project, userLocation) {
  if (!project) {
    return `
      <div class="charity-card alert alert-info">
        <p class="mb-0">
          <i class="bi bi-info-circle"></i>
          Unable to load charity project at this time.
          Please visit <a href="https://www.globalgiving.org/search/?size=25&nextPage=1&sortField=sortorder&selectedCountries=&loadAllResults=true&theme=food" target="_blank" rel="noopener noreferrer">GlobalGiving</a>
          to find food security projects to support.
        </p>
      </div>
    `;
  }

  const {
    id,
    title,
    summary,
    organization = {},
    imageLink = '',
    country = '',
    region = '',
    goal = 0,
    funding = 0,
    remaining = 0,
  } = project;

  const donationUrl = getDonationUrl(id, 20);
  const progressPercentage = goal > 0 ? Math.round((funding / goal) * 100) : 0;
  const location = country || region || userLocation.countryName;

  // Check if project is from user's country or a different one
  const isLocalProject = country && country.toLowerCase().includes(userLocation.countryName.toLowerCase());
  const locationBadge = !isLocalProject && country ? `
    <div class="alert alert-light border py-2 px-3 mb-3">
      <small>
        <i class="bi bi-geo-alt-fill"></i>
        No food/hunger projects found in ${userLocation.countryName}.
        Showing project from <strong>${country}</strong> instead.
      </small>
    </div>
  ` : '';

  return `
    <div class="charity-card card shadow-sm">
      <div class="card-header bg-success text-white">
        <h5 class="mb-0">
          <i class="bi bi-heart-fill"></i>
          Donate This Meal to a Good Cause
        </h5>
      </div>
      <div class="card-body">
        ${locationBadge}
        <div class="row">
          ${imageLink ? `
            <div class="col-md-4 mb-3 mb-md-0">
              <img src="${imageLink}" alt="${title}" class="img-fluid rounded charity-image">
            </div>
          ` : ''}
          <div class="${imageLink ? 'col-md-8' : 'col-12'}">
            <h6 class="charity-title">${title}</h6>
            <p class="text-muted mb-2">
              <small>
                <i class="bi bi-building"></i> ${organization.name || 'Organization'}
                ${location ? ` • <i class="bi bi-geo-alt"></i> ${location}` : ''}
              </small>
            </p>
            <p class="charity-summary">${summary || 'Support this important cause'}</p>

            ${goal > 0 ? `
              <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <small class="text-muted">Funding Progress</small>
                  <small class="text-muted">${progressPercentage}%</small>
                </div>
                <div class="progress" style="height: 8px;">
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
                  <small class="text-muted">$${funding.toLocaleString()} raised</small>
                  <small class="text-muted">$${goal.toLocaleString()} goal</small>
                </div>
              </div>
            ` : ''}

            <div class="d-grid">
              <a
                href="${donationUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-success btn-lg"
              >
                <i class="bi bi-gift-fill"></i>
                Donate €20 to This Cause
              </a>
            </div>
            <p class="text-center text-muted mt-2 mb-0">
              <small>Powered by <a href="https://www.globalgiving.org" target="_blank" rel="noopener noreferrer">GlobalGiving</a></small>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
