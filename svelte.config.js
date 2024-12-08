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
        'script-src': ['self', 'unsafe-inline', 'unsafe-eval'],
        'style-src': ['self', 'unsafe-inline'],
        'img-src': ['self', 'data:', 'blob:', 'https:'],
        'connect-src': ['self', 'blob:'],
        'media-src': ['self', 'blob:', 'https:'],
        'frame-src': ['self'],
        'font-src': ['self', 'https:', 'data:']
      }
    },
    prerender: {
      entries: [
        '/',
        '/about',
        '/privacy', 
        '/contact',
        '/404',
        '/sitemap.xml'  // 添加sitemap.xml的预渲染
      ],
      handleHttpError: 'warn',
      handleMissingId: 'warn',
      // 添加以下配置以确保所有页面都被正确处理
      crawl: true,
      concurrency: 10  // 可以根据需要调整并发数
    }
  }
};


export default config;