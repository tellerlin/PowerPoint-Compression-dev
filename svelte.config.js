import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        // 可选：如果仍有问题，可以尝试以下配置
        csp: {
            mode: 'auto'
        }
    }
};


export default config;