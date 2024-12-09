import { dev } from '$app/environment';


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


const sitemapRoutes = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'weekly' },
  { url: '/contact', priority: '0.7', changefreq: 'weekly' },
  { url: '/privacy', priority: '0.6', changefreq: 'monthly' }
];


export async function handle({ event, resolve }) {
  try {
    if (event.url.pathname === '/sitemap.xml') {
      return new Response(generateSitemap(sitemapRoutes), {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'max-age=0, s-maxage=3600'
        }
      });
    }


    const response = await resolve(event);


    if (!dev) {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      response.headers.set('Content-Security-Policy',   
        "default-src 'self' https:; " +  
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://res.wx.qq.com https://static.cloudflareinsights.com; " +  
        "style-src 'self' 'unsafe-inline' https:; " +  
        "img-src 'self' data: blob: https: http:; " +  
        "connect-src 'self' blob: https:; " +  
        "media-src 'self' blob: https:; " +  
        "frame-src 'self' https:; " +  
        "font-src 'self' https: data;"  
      );

    }


    return response;
  } catch (error) {
    console.error('SvelteKit handle error:', error);
    
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


export function handleError({ error, event }) {
  if (!dev) {
    console.error('Unhandled error:', error);
  }


  return {
    message: dev ? error.message : 'An unexpected error occurred',
    code: error.code ?? 'UNKNOWN'
  };
}