/**
 * Location service for getting user's country via IP geolocation
 */

import { getCurrencyForCountry } from './currency.js';

const CACHE_KEY = 'user_location_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Get user's country code and currency using IP geolocation
 * Uses geojs.io free service (no rate limits, no API key required)
 * Caches result in localStorage for 24 hours to minimize API calls
 * @returns {Promise<{countryCode: string, countryName: string, city: string, currency: string, currencySymbol: string}>}
 */
export async function getUserLocation() {
  // Check cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      // Use cached data if less than 24 hours old
      if (age < CACHE_DURATION) {
        console.log('Using cached location data');
        return data;
      }
    }
  } catch (e) {
    // If cache fails, continue to fetch
    console.warn('Failed to read location cache:', e);
  }

  // Fetch from API
  try {
    const response = await fetch('https://get.geojs.io/v1/ip/geo.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch location: ${response.status}`);
    }

    const data = await response.json();

    const currencyInfo = getCurrencyForCountry(data.country_code);

    const locationData = {
      countryCode: data.country_code,     // e.g., "US", "IE", "GB"
      countryName: data.country,           // e.g., "United States", "Ireland"
      city: data.city || 'Unknown',        // e.g., "Dublin"
      currency: currencyInfo.code,         // e.g., "USD", "EUR", "GBP" (from our mapping)
      currencySymbol: currencyInfo.symbol, // e.g., "$", "€", "£"
    };

    // Cache the result
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: locationData,
        timestamp: Date.now()
      }));
      console.log('Location data cached for 24 hours');
    } catch (e) {
      console.warn('Failed to cache location data:', e);
    }

    return locationData;
  } catch (error) {
    console.error('Error fetching user location:', error);

    // Fallback to EUR/Ireland
    return {
      countryCode: 'IE',
      countryName: 'Ireland',
      city: 'Unknown',
      currency: 'EUR',
      currencySymbol: '€',
    };
  }
}
