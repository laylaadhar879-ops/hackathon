# GlobalGiving API Setup Guide

This guide explains how to set up the GlobalGiving API integration for the "Donate This Meal" feature.

## Overview

The recipe detail page now includes a charity donation feature that:
1. Detects the user's location via IP geolocation
2. Finds food/hunger-related charity projects in their country
3. Displays a project card with donation option (€20)
4. Redirects to GlobalGiving for secure payment processing

## Required: Get Your GlobalGiving API Key

To use this feature, you need a free API key from GlobalGiving.

### Steps to Get API Key:

1. **Get Your API Key**
   - Visit: https://www.globalgiving.org/dy/v2/user/api/
   - Click "Get API Key" - it generates instantly
   - Copy your API key

2. **Add API Key to Your Project**
   - Copy `.env.example` to create `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open the `.env` file in the project root
   - Find this line:
     ```
     VITE_GLOBALGIVING_API_KEY=your_api_key_here
     ```
   - Replace `your_api_key_here` with your actual API key:
     ```
     VITE_GLOBALGIVING_API_KEY=your-actual-api-key-12345
     ```
   - Save the file
   - **Important**: The `.env` file is in `.gitignore` and won't be committed to git (keeps your API key secure)

## How It Works (Simplified MVP)

### 1. Recipe Page
- User views a recipe on the recipe detail page
- "Donate This Meal" button displayed below recipe

### 2. Charity Selection Modal
- User clicks button → Modal opens with 6 hunger/food security projects
- Projects sourced from GlobalGiving's **Food Security** theme globally
- Each project shows:
  - Project image
  - Title and summary
  - Organization name and location
  - Funding progress bar
  - "Donate €20" button

### 3. Donation Flow
- User selects a charity
- Opens GlobalGiving donation page in new tab with direct cart URL
- Amount pre-filled based on the recipe's calculated meal value
- GlobalGiving handles all payment processing and currency display

## Files Structure

```
project-root/
├── .env                     # Environment variables (API KEY HERE! - not in git)
├── .env.example             # Template for environment variables
├── src/
│   ├── services/
│   │   ├── location.js          # IP geolocation service
│   │   └── globalgiving.js      # GlobalGiving API integration
│   ├── components/
│   │   └── charity-card/
│   │       ├── charity-card.js  # Charity project card component
│   │       └── charity-card.css # Card styling
│   └── pages/
│       └── recipe-detail/
│           └── recipe-detail.js # Recipe page with charity integration
```

## Testing Locally

1. Get your GlobalGiving API key (see above)
2. Add the API key to your `.env` file:
   ```
   VITE_GLOBALGIVING_API_KEY=your-actual-api-key-12345
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Navigate to any recipe detail page
5. The charity card should appear below the recipe
6. Check browser console for any errors if the card doesn't appear

## API Rate Limits

- GlobalGiving API has rate limits
- Free tier typically allows several hundred requests per day
- IP geolocation (ipapi.co) free tier: 1,000 requests/day

## Currency Display

The donation amount is passed directly to GlobalGiving without conversion:
- GlobalGiving automatically displays amounts in the user's local currency based on their location
- Users in Europe will see amounts in EUR
- Users in the US will see amounts in USD
- The platform handles currency conversion and display automatically

## Troubleshooting

### "Unable to load charity project"
- Check if API key is set correctly
- Check browser console for error messages
- Verify API key is active and not expired

### No projects found for my country
- The app will automatically search globally
- Not all countries have food-related projects
- You can modify search keywords in `globalgiving.js`

### CORS errors
- GlobalGiving API should support CORS
- If issues persist, check API key permissions
- Contact GlobalGiving support

## Customization

### Change Donation Amount
Edit `src/services/globalgiving.js`:
```javascript
export function getDonationUrl(projectId, amount = 20) {
  // Change the default amount here
  const amountUSD = Math.round(amount * 1.1);
  // ...
}
```

### Change Search Keywords
Edit `src/services/globalgiving.js`:
```javascript
const searchQuery = encodeURIComponent('your custom keywords');
```

### Change Theme Filter
To filter by specific GlobalGiving themes:
1. Fetch themes: `https://api.globalgiving.org/api/public/projectservice/themes?api_key=YOUR_KEY`
2. Find theme ID (e.g., "food", "health")
3. Add to filter: `&filter=country:US,theme:food`

## Resources

- GlobalGiving API Docs: https://www.globalgiving.org/api/
- Search Projects Method: https://www.globalgiving.org/api/methods/search-projects/
- Get API Key: https://www.globalgiving.org/dy/v2/user/api/
- Bootstrap Icons (used in UI): https://icons.getbootstrap.com/

## Support

For GlobalGiving API issues:
- API Documentation: https://www.globalgiving.org/api/
- Developer Google Group: https://groups.google.com/g/globalgiving-api

For project issues:
- Open an issue in your repository
- Check browser console for errors
