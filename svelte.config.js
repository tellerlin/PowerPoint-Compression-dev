import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import adapter from '@sveltejs/adapter-cloudflare';


/** @type {import('@sveltejs/kit').Config} */
export default {
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
      handleHttpError: 'warn', // 处理预渲染错误
      entries: [
        '*',        // 预渲染所有页面
        '/about',
        '/privacy', 
        '/404',     // 明确指定预渲染 404 页面
        '/contact', // 可选：预渲染其他重要页面
        '/sitemap', 
        '/sitemap.xml'  // 添加这两行
      ]
    }
  }
};