<script>  
    import Header from './Header.svelte';  
    import '../app.css';  

    // Metadata for the entire site  
    const siteMetadata = {  
        title: 'ByteSlim - PowerPoint Compression Tool',  
        description: 'Efficiently compress PowerPoint files with our lightweight, user-friendly compression tool',  
        keywords: 'PowerPoint compression, file size reduction, document optimization',  
        author: 'ByteSlim Team',  
        url: 'https://byteslim.com'  
    };  

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
    <title>{siteMetadata.title}</title>  
    <meta name="description" content={siteMetadata.description}>  
    <meta name="keywords" content={siteMetadata.keywords}>  
    <meta name="author" content={siteMetadata.author}>  

    <!-- Content Security Policy -->  
    <meta http-equiv="Content-Security-Policy" content={cspContent}>  

    <!-- Open Graph / Facebook -->  
    <meta property="og:type" content="website">  
    <meta property="og:url" content={siteMetadata.url}>  
    <meta property="og:title" content={siteMetadata.title}>  
    <meta property="og:description" content={siteMetadata.description}>  
    <meta property="og:image" content="{siteMetadata.url}/og-image.png">  

    <!-- Structured Data -->  
    <script type="application/ld+json">  
        {JSON.stringify(jsonLd)}  
    </script>  

    <!-- Favicon and other critical head elements -->  
    <link rel="icon" href="/favicon.ico" type="image/x-icon">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
</svelte:head>  

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