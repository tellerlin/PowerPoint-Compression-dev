import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-cloudflare';


/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    prerender: {
      entries: [
        '/',
        '/about',
        '/privacy', 
        '/contact',
        '/sitemap.xml'
      ],
      crawl: true,
      handleHttpError: 'warn',
      handleMissingId: 'warn'
    }
  }
};


export default config;