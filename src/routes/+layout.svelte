<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import Header from './Header.svelte';
    import '../app.css';
    import { siteMetadata, preloadResources } from '$lib/config/metadata';
    import { initializeGoogleAnalytics, initializeWeChatMetaTags } from '$lib/utils/analytics';
    import { loadPreloadResources } from '$lib/utils/resource-loader';

    onMount(() => {
        // Load critical resources immediately
        loadPreloadResources(preloadResources);

        // Defer non-critical resource loading
        setTimeout(() => {
            initializeGoogleAnalytics();
            initializeWeChatMetaTags(siteMetadata);
        }, 2000);
    });
</script>

<svelte:head>  
    <title>{siteMetadata.title.en}</title>  
    <meta name="description" content={siteMetadata.description.en}>  
    <meta name="keywords" content={siteMetadata.keywords}>  
    <meta name="author" content={siteMetadata.author}>  
    <meta name="robots" content="index, follow">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="canonical" href={siteMetadata.url + $page.url.pathname}>

    <meta property="og:type" content="website">  
    <meta property="og:url" content={siteMetadata.url}>  
    <meta property="og:title" content={siteMetadata.title.en}>  
    <meta property="og:description" content={siteMetadata.description.en}>  
    <meta property="og:image" content="{siteMetadata.url}{siteMetadata.images.og}">  

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content={siteMetadata.url}>
    <meta name="twitter:title" content={siteMetadata.title.en}>
    <meta name="twitter:description" content={siteMetadata.description.en}>
    <meta name="twitter:image" content="{siteMetadata.url}{siteMetadata.images.twitter}">
</svelte:head>

<div class="app" lang="en" aria-label="ByteSlim Application">  
    <Header />  
    
    <main id="main-content" tabindex="-1">  
        <slot />  
    </main>  
    
    <footer aria-label="Site Footer" class="bg-gray-100 dark:bg-gray-800 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4">Navigation</h3>
                    <ul class="space-y-2">
                        <li><a href="/" class="text-gray-500 hover:text-blue-500">Home</a></li>
                        <li><a href="/about" class="text-gray-500 hover:text-blue-500">About</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Legal</h3>
                    <ul class="space-y-2">
                        <li><a href="/privacy" class="text-gray-500 hover:text-blue-500">Privacy Policy</a></li>
                        <li><a href="/sitemap" class="text-gray-500 hover:text-blue-500">Sitemap</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Connect</h3>
                    <ul class="space-y-2">
                        <li><a href="/contact" class="text-gray-500 hover:text-blue-500">Contact Us</a></li>
                    </ul>
                </div>
            </div>
            <div class="mt-8 text-center text-gray-500">
                © {new Date().getFullYear()} ByteSlim. All rights reserved.
            </div>
        </div>
    </footer>
</div>  

<style>  
    .app {  
        display: flex;  
        flex-direction: column;  
        min-height: 100vh;  
        width: 100%;  
    }  

    main {  
        flex: 1 0 auto;  
        width: 100%;  
        overflow-y: auto;  
    }  

    :global(body) {
        scroll-behavior: smooth;
    }

    @media (prefers-reduced-motion: reduce) {
        :global(body) {
            scroll-behavior: auto;
        }
    }
</style>