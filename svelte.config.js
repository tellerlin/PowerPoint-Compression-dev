import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    csp: {
      directives: {
        'default-src': ['self', 'https:'],
        'script-src': [
          'self', 
          'unsafe-inline', 
          'unsafe-eval', 
          'blob:',
          'https://www.googletagmanager.com',
          'https://res.wx.qq.com'
        ],
        'style-src': ['self', 'unsafe-inline'],
        'img-src': ['self', 'data:', 'blob:', 'https:'],
        'connect-src': ['self', 'blob:', 'https:'],
        'media-src': ['self', 'blob:', 'https:'],
        'frame-src': ['self'],
        'font-src': ['self', 'https:', 'data:'],
        'worker-src': ['self', 'blob:']
      }
    },
    prerender: {
      entries: [
        '/',
        '/about',
        '/privacy', 
        '/contact',
        '/sitemap.xml',
        '/sitemap'
      ],
      crawl: true,
      handleHttpError: 'warn',
      handleMissingId: 'warn'
    }
  }
};

export default config;