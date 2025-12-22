# Cloudflare Functions Setup Guide

This guide explains how to set up and deploy Cloudflare Functions for secure API key management.

## Overview

The GlobalGiving API key has been moved from client-side code to server-side Cloudflare Functions to prevent exposure. This ensures that sensitive API keys are never visible in:
- Browser network requests
- Browser DevTools
- Client-side JavaScript bundles
- Source control

## Architecture

```
Frontend (src/services/globalgiving.js)
    ↓
    Calls /api/charities
    ↓
Cloudflare Function (functions/api/charities.js)
    ↓
    Uses server-side API key
    ↓
GlobalGiving API
```

## Local Development Setup

### 1. Install Dependencies

Wrangler is already included as a dev dependency:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.dev.vars` file in the project root (already done):

```bash
cp .dev.vars.example .dev.vars
```

The `.dev.vars` file should contain:
```
GLOBALGIVING_API_KEY=your_api_key_here
```

**Note**: The `.dev.vars` file is already in `.gitignore` and will not be committed to the repository.

### 3. Run Local Development Server

Simply run the dev command - it now includes Wrangler to serve Cloudflare Functions:

```bash
npm run dev
```

This will:
- Start Wrangler on port 8788
- Proxy your Vite dev server through Wrangler
- Make Cloudflare Functions available at `/api/*` routes
- Enable hot reloading for both frontend and functions

**Alternative commands:**
- `npm run dev:vite-only` - Run only Vite without Cloudflare Functions
- `npm run preview:functions` - Preview the production build with functions

## Production Deployment

### Option 1: Deploy via Cloudflare Dashboard

1. Go to your Cloudflare Pages project dashboard
2. Navigate to **Settings** → **Environment variables**
3. Add the following environment variable:
   - **Variable name**: `GLOBALGIVING_API_KEY`
   - **Value**: Your GlobalGiving API key
   - **Environment**: Production (and Preview if needed)
4. Click **Save**

### Option 2: Deploy via Wrangler CLI

1. Authenticate with Cloudflare:
```bash
wrangler login
```

2. Set the environment variable:
```bash
wrangler pages secret put GLOBALGIVING_API_KEY
# Enter your API key when prompted
```

3. Deploy your project:
```bash
wrangler pages deploy dist
```

## API Endpoints

### GET /api/charities

Fetches food/hunger-related charity projects from GlobalGiving.

**Query Parameters:**
- `start` (optional): Pagination offset (default: 0)
- `countryCode` (optional): ISO 2-letter country code (currently unused)

**Example Request:**
```javascript
fetch('/api/charities?start=0')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Response:**
```json
{
  "projects": [...],
  "totalFound": 100,
  "currentStart": 0
}
```

## Security Best Practices

1. **Never commit API keys** to version control
   - `.env` is in `.gitignore`
   - `.dev.vars` is in `.gitignore`

2. **Rotate exposed keys immediately**
   - If you previously committed the API key, revoke it at https://www.globalgiving.org/dy/v2/user/api/
   - Generate a new API key

3. **Use environment variables**
   - Store all sensitive data in environment variables
   - Never use `VITE_` prefix for secrets (this exposes them to the client)

4. **Monitor API usage**
   - Check your GlobalGiving API dashboard regularly
   - Set up rate limiting in Cloudflare if needed

## Troubleshooting

### Function returns "API key not configured"

- **Local Development**: Ensure `.dev.vars` exists with `GLOBALGIVING_API_KEY`
- **Production**: Check that the environment variable is set in Cloudflare Pages settings

### CORS errors

The Cloudflare Function includes CORS headers (`Access-Control-Allow-Origin: *`). If you still see CORS errors:
1. Check that the function is deployed correctly
2. Verify the fetch URL in `src/services/globalgiving.js` is correct

### Function not found (404)

Ensure the function file is in the correct location:
```
functions/
  └── api/
      └── charities.js
```

Cloudflare Pages automatically routes requests to `/api/charities` to `functions/api/charities.js`.

## Files Modified

- `functions/api/charities.js` - New Cloudflare Function
- `src/services/globalgiving.js` - Updated to call Cloudflare Function
- `.dev.vars` - Local development environment variables
- `.dev.vars.example` - Template for local environment variables
- `.gitignore` - Added `.dev.vars` to prevent committing secrets
- `.env` - Removed `VITE_GLOBALGIVING_API_KEY` (no longer needed)
- `.env.example` - Updated documentation

## Additional Resources

- [Cloudflare Pages Functions Documentation](https://developers.cloudflare.com/pages/functions/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [GlobalGiving API Documentation](https://www.globalgiving.org/api/)
