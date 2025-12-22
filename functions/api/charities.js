/**
 * Cloudflare Function to securely proxy GlobalGiving API requests
 * This keeps the API key on the server side and prevents client-side exposure
 *
 * Endpoint: /api/charities
 * Query Parameters:
 *   - start: Pagination offset (default: 0)
 *   - countryCode: ISO 2-letter country code (optional, not used currently)
 */

export async function onRequestGet(context) {
  const { request, env } = context;

  // Get the API key from Cloudflare environment variables
  const API_KEY = env.GLOBALGIVING_API_KEY;

  if (!API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'API key not configured',
        projects: [],
        totalFound: 0,
        currentStart: 0
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }

  // Parse query parameters from the request URL
  const url = new URL(request.url);
  const start = url.searchParams.get('start') || '0';
  const countryCode = url.searchParams.get('countryCode') || '';

  try {
    // Make the API call to GlobalGiving (API key is kept server-side)
    const apiUrl = `https://api.globalgiving.org/api/public/services/search/projects?api_key=${API_KEY}&q=*&filter=theme:hunger&start=${start}`;

    const response = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          projects: [],
          totalFound: 0,
          currentStart: parseInt(start)
        }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const data = await response.json();

    // Process the response (same logic as in globalgiving.js)
    if (data.search && data.search.response && data.search.response.projects && data.search.response.projects.project) {
      let projects = Array.isArray(data.search.response.projects.project)
        ? data.search.response.projects.project
        : [data.search.response.projects.project];

      // Filter out any inactive projects
      projects = projects.filter(p => p.active === true || p.status === 'active');

      // Tag all as global
      projects.forEach(p => {
        p._source = 'global';
        p._sourceCountry = p.country || p.iso3166CountryCode || 'Unknown';
      });

      const totalFound = data.search.response.numberFound || 0;

      return new Response(
        JSON.stringify({
          projects: projects,
          totalFound: totalFound,
          currentStart: parseInt(start),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        projects: [],
        totalFound: 0,
        currentStart: parseInt(start)
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    console.error('Error fetching charity projects:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch charity projects',
        projects: [],
        totalFound: 0,
        currentStart: parseInt(start)
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}
