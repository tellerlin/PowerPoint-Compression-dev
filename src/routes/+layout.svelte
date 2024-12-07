<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte';  
  import '../app.css';  


  // Metadata for the entire site  
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
    url: 'https://byteslim.com'  
  };  


  onMount(() => {
    // 检测平台的函数
    function detectPlatform() {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('micromessenger')) {
        return 'wechat';
      }
      return 'other';
    }


    // 根据平台和语言设置 meta 标签
    const platform = detectPlatform();
    
    const config = platform === 'wechat' 
      ? {
          title: siteMetadata.title.zh,
          description: siteMetadata.description.zh
        }
      : {
          title: siteMetadata.title.en,
          description: siteMetadata.description.en
        };


    // 动态设置 meta 标签的数组
    const metaTags = [
      // Open Graph / Facebook
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: siteMetadata.url },
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:image', content: `${siteMetadata.url}/og-image.png` },


      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: siteMetadata.url },
      { name: 'twitter:title', content: config.title },
      { name: 'twitter:description', content: config.description },
      { name: 'twitter:image', content: `${siteMetadata.url}/twitter-image.png` }
    ];


    // 移除之前可能存在的动态 meta 标签
    const existingDynamicMeta = document.querySelectorAll('meta[data-dynamic="true"]');
    existingDynamicMeta.forEach(tag => tag.remove());


    // 动态添加 meta 标签
    metaTags.forEach(tag => {
      const metaTag = document.createElement('meta');
      Object.keys(tag).forEach(key => {
        metaTag.setAttribute(key, tag[key]);
      });
      // 添加一个标记，方便后续清理
      metaTag.setAttribute('data-dynamic', 'true');
      document.head.appendChild(metaTag);
    });
  });


  // Structured JSON-LD data  
  const jsonLd = {  
    "@context": "https://schema.org",  
    "@type": "WebApplication",  
    "name": "ByteSlim",  
    "description": "PowerPoint file compression tool",  
    "applicationCategory": "Productivity",  
    "offers": {  
      "@type": "Offer",  
      "price": "0",  
      "priceCurrency": "USD"  
    }  
  };  


  // CSP configuration  
  const cspContent = [  
    "default-src 'self' https:",  
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  
    "style-src 'self' 'unsafe-inline'",  
    "img-src 'self' data: blob: https:",  
    "connect-src 'self' blob:",  
    "media-src 'self' blob: https:",  
    "frame-src 'self'",  
    "font-src 'self' https: data:",  
  ].join('; ');  
</script>  


<svelte:head>  
    <!-- Primary Meta Tags -->  
    <title>{siteMetadata.title.en}</title>  
    <meta name="description" content={siteMetadata.description.en}>  
    <meta name="keywords" content={siteMetadata.keywords}>  
    <meta name="author" content={siteMetadata.author}>  


    <!-- Content Security Policy -->  
    <meta http-equiv="Content-Security-Policy" content={cspContent}>  


    <!-- Structured Data -->  
    <script type="application/ld+json">  
        {JSON.stringify(jsonLd)}  
    </script>  


    <!-- Favicon and other critical head elements -->  
    <link rel="icon" href="/favicon.ico" type="image/x-icon">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
</svelte:head>  


<!-- 保持原有的页面结构和样式 -->
<div   
    class="app"   
    lang="en"   
    aria-label="ByteSlim Application"  
>  
    <Header />  
    
    <main id="main-content" tabindex="-1">  
        <slot />  
    </main>  
    
    <footer aria-label="Site Footer">  
        <div class="footer-container">  
            <div class="footer-content">  
                <p>&copy; {new Date().getFullYear()} ByteSlim. All rights reserved.</p>  
                
                <nav class="footer-nav" aria-label="Footer Navigation">  
                    <ul>  
                        <li><a href="/about">About</a></li>  
                    </ul>  
                </nav>  
            </div>  
        </div>  
    </footer>  
</div>  

<style>  
    /* Reset default margins and paddings */  
    * {  
        margin: 0;  
        padding: 0;  
        box-sizing: border-box;  
    }  

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

    footer {  
        flex-shrink: 0;  
        background-color: #f8f9fa;  
        color: #333;  
        padding: 1rem;  
        border-top: 1px solid #e9ecef;  
        width: 100%;  
        margin-top: auto;  
    }  

    .footer-container {  
        max-width: 1200px;  
        margin: 0 auto;  
    }  

    .footer-content {  
        display: flex;  
        flex-direction: column;  
        align-items: center;  
        gap: 1rem;  
    }  

    .footer-nav ul {  
        display: flex;  
        list-style: none;  
        padding: 0;  
        gap: 1rem;  
    }  

    .footer-nav a {  
        color: #495057;  
        text-decoration: none;  
        transition: color 0.3s ease;  
    }  

    .footer-nav a:hover {  
        color: #007bff;  
    }  

    @media (min-width: 768px) {  
        .footer-content {  
            flex-direction: row;  
            justify-content: space-between;  
            align-items: center;  
        }  

        .footer-nav {  
            text-align: center;  
        }  
    }  
</style>