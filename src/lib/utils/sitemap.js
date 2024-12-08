export async function getPages() {
    const site = 'https://byteslim.com';
    
    // 静态页面
    const staticPages = [
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
        }
    ];


    // 如果有动态页面，可以在这里添加
    const dynamicPages = await getDynamicPages();


    return [...staticPages, ...dynamicPages];
}


// 用于获取动态页面的函数（如果需要）
async function getDynamicPages() {
    // 这里可以从数据库或其他来源获取动态页面
    return [];
}