export const prerender = true;


export async function GET() {
    const routes = [
        { path: '/', priority: '1.0', changefreq: 'daily' },
        { path: '/about', priority: '0.8', changefreq: 'weekly' },
        { path: '/privacy', priority: '0.6', changefreq: 'monthly' },
        { path: '/contact', priority: '0.7', changefreq: 'weekly' }
    ];


    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${routes.map(route => `
    <url>
        <loc>https://www.byteslim.com${route.path}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`).join('')}
</urlset>`;


    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}