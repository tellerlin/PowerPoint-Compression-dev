export const prerender = true;


export async function GET() {
    const routes = [
        '/',
        '/about',
        '/privacy',
        '/contact'
    ];


    const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes.map(route => `
    <url>
        <loc>https://www.byteslim.com${route}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}
</urlset>`;


    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml'
        }
    });
}