export async function getPages() {
    const site = 'https://byteslim.com';
    
    return [
        { 
            loc: `${site}/`, 
            priority: '1.0', 
            changefreq: 'daily' 
        },
        { 
            loc: `${site}/about`, 
            priority: '0.8', 
            changefreq: 'weekly' 
        },
        { 
            loc: `${site}/contact`, 
            priority: '0.7', 
            changefreq: 'weekly' 
        },
        { 
            loc: `${site}/privacy`, 
            priority: '0.6', 
            changefreq: 'monthly' 
        },
        {
            loc: `${site}/404`,
            priority: '0.1',
            changefreq: 'yearly'
        },
        { 
            loc: `${site}/sitemap`, 
            priority: '0.5', 
            changefreq: 'daily'
        }
    ];
}
