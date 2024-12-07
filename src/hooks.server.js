import { dev } from '$app/environment';


// Sitemap generation function
function generateSitemap(routes) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
    <url>
      <loc>https://byteslim.com${route.url}</loc>
      <priority>${route.priority}</priority>
      <changefreq>${route.changefreq || 'weekly'}</changefreq>
    </url>
  `).join('')}
</urlset>`;
}


// Define your routes
const sitemapRoutes = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'weekly' }
];


export async function handle({ event, resolve }) {
  try {
    // Sitemap handling
    if (event.url.pathname === '/sitemap.xml') {
      return new Response(generateSitemap(sitemapRoutes), {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'max-age=0, s-maxage=3600' // Cache for 1 hour
        }
      });
    }


    // Resolve the event
    const response = await resolve(event);


    // Add security headers (only in production)
    if (!dev) {
      // Security headers
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.headers.set('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self';"
      );
    }


    return response;
  } catch (error) {
    console.error('SvelteKit handle error:', error);
    
    // Enhanced error handling
    return new Response(
      JSON.stringify({
        message: 'An unexpected error occurred',
        error: dev ? error.message : 'Internal Server Error'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}


// Optional: More detailed error handling
export function handleError({ error, event }) {
  // Log errors to a service in production
  if (!dev) {
    // Example: Send error to logging service
    // logErrorToService(error);
  }


  return {
    message: dev ? error.message : 'An unexpected error occurred',
    code: error.code ?? 'UNKNOWN'
  };
}