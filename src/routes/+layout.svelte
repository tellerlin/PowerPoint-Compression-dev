<script>
  import { onMount } from 'svelte';
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
    // 添加微信分享所需的 meta 标签
    const wechatMetaTags = [
      { name: 'description', content: siteMetadata.description.zh },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: siteMetadata.title.zh },
      { property: 'og:description', content: siteMetadata.description.zh },
      { property: 'og:image', content: `${siteMetadata.url}${siteMetadata.images.wechat}` },
      
      // 微信特定的 meta 标签
      { name: 'weixin:type', content: 'webpage' },
      { name: 'weixin:title', content: siteMetadata.title.zh },
      { name: 'weixin:description', content: siteMetadata.description.zh },
      { name: 'weixin:image', content: `${siteMetadata.url}${siteMetadata.images.wechat}` }
    ];


    // 添加微信分享所需的 meta 标签
    wechatMetaTags.forEach(tag => {
      const metaTag = document.createElement('meta');
      Object.keys(tag).forEach(key => {
        metaTag.setAttribute(key, tag[key]);
      });
      metaTag.setAttribute('data-dynamic', 'true');
      document.head.appendChild(metaTag);
    });


    // 添加 WeChat JS-SDK 配置（如果需要）
    const wxScript = document.createElement('script');
    wxScript.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
    wxScript.async = true;
    document.head.appendChild(wxScript);
  });
</script>


<svelte:head>  
    <!-- 原有的 meta 标签 -->
    <title>{siteMetadata.title.en}</title>  
    <meta name="description" content={siteMetadata.description.en}>  
    <meta name="keywords" content={siteMetadata.keywords}>  
    <meta name="author" content={siteMetadata.author}>  


    <!-- Open Graph / Facebook -->  
    <meta property="og:type" content="website">  
    <meta property="og:url" content={siteMetadata.url}>  
    <meta property="og:title" content={siteMetadata.title.en}>  
    <meta property="og:description" content={siteMetadata.description.en}>  
    <meta property="og:image" content="{siteMetadata.url}{siteMetadata.images.og}">  


    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content={siteMetadata.url}>
    <meta name="twitter:title" content={siteMetadata.title.en}>
    <meta name="twitter:description" content={siteMetadata.description.en}>
    <meta name="twitter:image" content="{siteMetadata.url}{siteMetadata.images.twitter}">
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