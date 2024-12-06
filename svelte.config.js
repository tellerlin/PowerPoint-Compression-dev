import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            // 可以添加一些额外的配置
            routes: {
                include: ['/*'],
                exclude: ['<all>']
            }
        }),
        csp: {
            mode: 'auto'
        }
    }
};


export default config;