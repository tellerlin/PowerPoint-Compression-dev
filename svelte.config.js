import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            routes: {
                include: ['/*'], // 包含所有路由
                exclude: ['<all>'] // 确保所有路由都被处理
            }
        }),
        csp: {
            mode: 'auto'
        }
    }
};


export default config;