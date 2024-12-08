import { dev } from '$app/environment';


export const prerender = true;


const site = 'https://www.byteslim.com';


const pages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/about', priority: '0.8', changefreq: 'weekly' },
    { path: '/privacy', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'weekly' }
];


export async function GET() {
    const urlset = pages.map(page => `
    <url>
        <loc>${site}${page.path}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join('');


    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlset}
</urlset>`;


    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}