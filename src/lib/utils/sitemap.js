export async function getPages() {
    const site = 'https://byteslim.com';
    const today = new Date().toISOString().split('T')[0];
    
    return [
        { 
            loc: `${site}/`, 
            lastmod: today,
            priority: '1.0', 
            changefreq: 'daily' 
        },
        { 
            loc: `${site}/about`, 
            lastmod: today,
            priority: '0.8', 
            changefreq: 'weekly' 
        },
        { 
            loc: `${site}/contact`, 
            lastmod: today,
            priority: '0.7', 
            changefreq: 'weekly' 
        },
        { 
            loc: `${site}/privacy`, 
            lastmod: today,
            priority: '0.6', 
            changefreq: 'monthly' 
        },
        { 
            loc: `${site}/sitemap`, 
            lastmod: today,
            priority: '0.5', 
            changefreq: 'monthly' 
        }
    ];
}