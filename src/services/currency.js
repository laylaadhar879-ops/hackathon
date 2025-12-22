/**
 * Currency conversion and formatting service
 *
 * Base currency: EUR (European Euro)
 * All meal values are estimated in EUR, then converted to user's local currency
 */

/**
 * Currency data with conversion rates from EUR
 * Rates are approximate and can be updated periodically
 * Last updated: December 2025
 */
const CURRENCY_DATA = {
  // US Dollar
  'USD': { symbol: '$', rate: 1.1, name: 'US Dollar' },

  // British Pound
  'GBP': { symbol: '£', rate: 0.85, name: 'British Pound' },

  // Euro (base currency)
  'EUR': { symbol: '€', rate: 1, name: 'Euro' },

  // Canadian Dollar
  'CAD': { symbol: 'C$', rate: 1.5, name: 'Canadian Dollar' },

  // Australian Dollar
  'AUD': { symbol: 'A$', rate: 1.65, name: 'Australian Dollar' },

  // Japanese Yen
  'JPY': { symbol: '¥', rate: 160, name: 'Japanese Yen' },

  // Swiss Franc
  'CHF': { symbol: 'CHF', rate: 0.95, name: 'Swiss Franc' },

  // New Zealand Dollar
  'NZD': { symbol: 'NZ$', rate: 1.8, name: 'New Zealand Dollar' },

  // Swedish Krona
  'SEK': { symbol: 'kr', rate: 11.5, name: 'Swedish Krona' },

  // Norwegian Krone
  'NOK': { symbol: 'kr', rate: 11.8, name: 'Norwegian Krone' },

  // Danish Krone
  'DKK': { symbol: 'kr', rate: 7.45, name: 'Danish Krone' },
};

/**
 * Map country codes to their primary currency
 * Used as fallback if API doesn't return currency
 */
const COUNTRY_TO_CURRENCY = {
  // North America
  'US': 'USD',
  'CA': 'CAD',

  // Europe - Euro countries
  'IE': 'EUR', 'FR': 'EUR', 'DE': 'EUR', 'ES': 'EUR', 'IT': 'EUR',
  'PT': 'EUR', 'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'FI': 'EUR',
  'GR': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'CY': 'EUR', 'SI': 'EUR',
  'SK': 'EUR', 'EE': 'EUR', 'LV': 'EUR', 'LT': 'EUR',

  // Europe - Non-Euro
  'GB': 'GBP',
  'CH': 'CHF',
  'SE': 'SEK',
  'NO': 'NOK',
  'DK': 'DKK',

  // Oceania
  'AU': 'AUD',
  'NZ': 'NZD',

  // Asia
  'JP': 'JPY',
};

/**
 * Get currency information for a country code
 * @param {string} countryCode - ISO 2-letter country code (e.g., "US", "GB")
 * @returns {{code: string, symbol: string, rate: number, name: string}}
 */
export function getCurrencyForCountry(countryCode) {
  const currencyCode = COUNTRY_TO_CURRENCY[countryCode] || 'USD';
  return {
    code: currencyCode,
    ...(CURRENCY_DATA[currencyCode] || CURRENCY_DATA['USD'])
  };
}

/**
 * Get currency information by currency code
 * @param {string} currencyCode - Currency code (e.g., "USD", "EUR", "GBP")
 * @returns {{code: string, symbol: string, rate: number, name: string}}
 */
export function getCurrencyInfo(currencyCode) {
  return {
    code: currencyCode,
    ...(CURRENCY_DATA[currencyCode] || CURRENCY_DATA['USD'])
  };
}

/**
 * Convert EUR amount to target currency
 * @param {number} eurAmount - Amount in EUR
 * @param {string} targetCurrency - Target currency code (e.g., "USD", "GBP")
 * @returns {number} - Converted amount (rounded)
 */
export function convertFromEUR(eurAmount, targetCurrency) {
  const currency = CURRENCY_DATA[targetCurrency] || CURRENCY_DATA['USD'];
  return Math.round(eurAmount * currency.rate);
}

/**
 * Format amount with currency symbol
 * @param {number} amount - Numeric amount
 * @param {string} currencyCode - Currency code (e.g., "USD", "EUR")
 * @returns {string} - Formatted string (e.g., "$10", "€8", "£7")
 */
export function formatCurrency(amount, currencyCode) {
  const currency = CURRENCY_DATA[currencyCode] || CURRENCY_DATA['USD'];
  return `${currency.symbol}${amount}`;
}

/**
 * Format amount with currency symbol from user location object
 * @param {number} amount - Numeric amount
 * @param {Object} userLocation - User location object with currency/currencySymbol
 * @returns {string} - Formatted string (e.g., "$10", "€8", "£7")
 */
export function formatCurrencyFromLocation(amount, userLocation) {
  const symbol = userLocation.currencySymbol || '$';
  return `${symbol}${amount}`;
}
