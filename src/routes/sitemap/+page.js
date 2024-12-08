export const prerender = true;


export function load() {
    const sitemapLinks = [
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
        { name: 'Privacy', url: '/privacy' },
        { name: 'Contact', url: '/contact' }
    ];


    return { sitemapLinks };
}