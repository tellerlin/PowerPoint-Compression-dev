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
</script>


<svelte:head>
    <!-- Primary Meta Tags -->
    <title>{siteMetadata.title}</title>
    <meta name="description" content={siteMetadata.description}>
    <meta name="keywords" content={siteMetadata.keywords}>
    <meta name="author" content={siteMetadata.author}>


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


    <!-- Preload critical resources -->


    <!-- Favicon and other critical head elements -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>


<div 
    class="app" 
    lang="en" 
    aria-label="ByteSlim Application"
>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <Header />
    
    <main id="main-content" tabindex="-1">
        <slot />
    </main>
    
    <footer 
        role="contentinfo" 
        aria-label="Site Footer"
    >
        <div class="footer-content">
            <p>&copy; {new Date().getFullYear()} ByteSlim. All rights reserved.</p>
            <nav aria-label="Footer Navigation">
                <ul>
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms of Service</a></li>
                </ul>
            </nav>
        </div>
    </footer>
</div>


<style>
    /* Existing styles remain the same */
    
    /* Skip link for accessibility */
    .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #000;
        color: white;
        padding: 8px;
        z-index: 100;
    }


    .skip-link:focus {
        top: 0;
    }


    .footer-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }


    .footer-content nav ul {
        display: flex;
        list-style: none;
        padding: 0;
        gap: 1rem;
    }


    @media (min-width: 768px) {
        .footer-content {
            flex-direction: row;
            justify-content: space-between;
        }
    }
</style>