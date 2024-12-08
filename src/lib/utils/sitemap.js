export async function getPages() {
    const site = 'https://byteslim.com';
    
    return [
        { 
            loc: `${site}/`, 
            priority: '1.0', 
            changefreq: 'daily',
            lastmod: new Date().toISOString().split('T')[0]
        },
        { 
            loc: `${site}/about`, 
            priority: '0.8', 
            changefreq: 'weekly',
            lastmod: new Date().toISOString().split('T')[0]
        },
        { 
            loc: `${site}/contact`, 
            priority: '0.7', 
            changefreq: 'weekly',
            lastmod: new Date().toISOString().split('T')[0]
        },
        { 
            loc: `${site}/privacy`, 
            priority: '0.6', 
            changefreq: 'monthly',
            lastmod: new Date().toISOString().split('T')[0]
        }
    ];
}