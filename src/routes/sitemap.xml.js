import { getPages } from '$lib/utils/sitemap';


export const prerender = true;


export async function GET() {
    const pages = await getPages();
    const sitemap = generateSitemap(pages);


    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}


function generateSitemap(pages) {
    const urlset = pages.map(page => `
    <url>
        <loc>${page.loc}</loc>
        <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${page.changefreq || 'weekly'}</changefreq>
        <priority>${page.priority || '0.5'}</priority>
    </url>`).join('');


    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlset}
</urlset>`;
}