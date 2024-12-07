<script>
    import { page } from '$app/stores';


    // Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "ByteSlim - PPTX Compression Tool",
        "description": "Efficient PowerPoint file compression tool with privacy-first approach",
        "mainEntity": {
            "@type": "WebApplication",
            "name": "ByteSlim",
            "applicationCategory": "Productivity",
            "operatingSystem": "All",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            }
        }
    };
</script>


<svelte:head>
    <title>ByteSlim - Efficient PowerPoint Compression Tool</title>
    <meta name="description" content="Reduce PowerPoint file sizes quickly and securely. Maintain high-quality visuals with our advanced compression technology.">
    <meta name="keywords" content="PowerPoint compression, file size reduction, presentation optimization, privacy-first tool">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="ByteSlim - Efficient PowerPoint Compression Tool">
    <meta property="og:description" content="Reduce PowerPoint file sizes quickly and securely. Maintain high-quality visuals with our advanced compression technology.">
    <meta property="og:url" content="https://byteslim.com/about">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
    </script>
</svelte:head>


<div class="max-w-6xl mx-auto px-6 py-8 bg-white dark:bg-gray-900">
    <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            About Our PPTX Compression Tool
        </h1>
    </div>


    <div class="grid md:grid-cols-2 gap-8 mb-8">
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 class="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">
                Professional Compression Technology
            </h2>
            <p class="text-gray-700 dark:text-gray-300 text-sm">
                Utilizing advanced algorithms to efficiently reduce presentation file size while maintaining visual quality.
            </p>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 class="text-xl font-bold mb-3 text-green-600 dark:text-green-400">
                Privacy First Approach
            </h2>
            <p class="text-gray-700 dark:text-gray-300 text-sm">
                We prioritize your data security. All processed files are automatically deleted upon page closure.
            </p>
        </div>
    </div>


    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center mb-8">
        <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            Contact Us
        </h2>
        <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm">
            <a 
                href="mailto:info@byteslim.com" 
                class="text-blue-600 hover:underline"
                aria-label="Contact Email"
            >
                info@byteslim.com
            </a>
        </p>
    </div>


    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center">
        <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            Support Us
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto text-sm overflow-wrap-break-word">
            Keeping this ad-free tool running takes significant effort. If you find it valuable, consider buying me a coffee.
        </p>
        <div class="flex justify-center space-x-24">
            <div id="buy-me-a-coffee-qr" class="w-32 h-32">
                <img 
                    src="/bmc_qr.png" 
                    alt="Buy Me a Coffee Donation QR Code" 
                    class="w-full h-full object-contain rounded-lg"
                    loading="lazy"
                    width="128"
                    height="128"
                />
            </div>
            <div id="alipay-qr" class="w-32 h-40">
                <img 
                    src="/alipay_qr.png" 
                    alt="Alipay Donation QR Code" 
                    class="w-full h-full object-contain rounded-lg"
                    loading="lazy"
                    width="128"
                    height="160"
                />
            </div>
        </div>
    </div>
</div>