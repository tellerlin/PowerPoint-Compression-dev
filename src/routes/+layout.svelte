<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Header from './Header.svelte';  
  import '../app.css';  

  const siteMetadata = {  
    title: {
      en: 'ByteSlim - PowerPoint Compression Tool',
      zh: 'ByteSlim - PPT压缩工具'
    },
    description: {
      en: 'Efficiently compress PowerPoint files with our lightweight, user-friendly compression tool',
      zh: '使用我们轻量级、用户友好的压缩工具，高效压缩PowerPoint文件'
    },
    keywords: 'PowerPoint compression, file size reduction, document optimization',
    author: 'ByteSlim Team',  
    url: 'https://byteslim.com',
    images: {
      og: '/og-image.jpg',
      twitter: '/twitter-image.jpg',
      wechat: '/wechat-image.jpg'
    }
  };  

  onMount(() => {
    // Google Analytics Setup
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=G-M91P9505Z1`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-M91P9505Z1');

    // WeChat Meta Tags
    const wechatMetaTags = [
      { name: 'description', content: siteMetadata.description.zh },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: siteMetadata.title.zh },
      { property: 'og:description', content: siteMetadata.description.zh },
      { property: 'og:image', content: `${siteMetadata.url}${siteMetadata.images.wechat}` },
      
      { name: 'weixin:type', content: 'webpage' },
      { name: 'weixin:title', content: siteMetadata.title.zh },
      { name: 'weixin:description', content: siteMetadata.description.zh },
      { name: 'weixin:image', content: `${siteMetadata.url}${siteMetadata.images.wechat}` }
    ];

    wechatMetaTags.forEach(tag => {
      const metaTag = document.createElement('meta');
      Object.keys(tag).forEach(key => {
        metaTag.setAttribute(key, tag[key]);
      });
      metaTag.setAttribute('data-dynamic', 'true');
      document.head.appendChild(metaTag);
    });

    const wxScript = document.createElement('script');
    wxScript.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
    wxScript.async = true;
    document.head.appendChild(wxScript);
  });
</script>

<svelte:head>  
    <title>{siteMetadata.title.en}</title>  
    <meta name="description" content={siteMetadata.description.en}>  
    <meta name="keywords" content={siteMetadata.keywords}>  
    <meta name="author" content={siteMetadata.author}>  

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
</style>