<script>
    import { page } from '$app/stores';


    const features = [
        {
            title: "Advanced Compression",
            description: "Cutting-edge algorithms that reduce file size without compromising visual quality.",
            icon: "🚀"
        },
        {
            title: "Privacy First",
            description: "Your data is sacred. Files are processed and immediately deleted.",
            icon: "🔒"
        },
        {
            title: "Cross-Platform",
            description: "Works seamlessly across different devices and operating systems.",
            icon: "💻"
        }
    ];


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
    
    <meta property="og:type" content="website">
    <meta property="og:title" content="ByteSlim - Efficient PowerPoint Compression Tool">
    <meta property="og:description" content="Reduce PowerPoint file sizes quickly and securely. Maintain high-quality visuals with our advanced compression technology.">
    <meta property="og:url" content="https://byteslim.com/about">
    
    <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
    </script>
</svelte:head>


<div class="bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
        <h1 class="text-5xl font-extrabold text-transparent bg-clip-text 
                   bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
            ByteSlim
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Revolutionizing PowerPoint compression with technology that preserves quality and protects privacy.
        </p>
    </div>


    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid md:grid-cols-3 gap-8">
            {#each features as feature}
                <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    <div class="text-4xl mb-4">{feature.icon}</div>
                    <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                        {feature.title}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300">
                        {feature.description}
                    </p>
                </div>
            {/each}
        </div>
    </div>


    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center">
        <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            Support Us
        </h2>

        <p class="text-base text-gray-600 dark:text-gray-300 mb-4 max-w-4xl mx-auto text-center whitespace-normal md:whitespace-nowrap">
            Keeping this ad-free tool running takes significant effort. If you find it valuable, consider buying me a coffee.
        </p>

        <div class="flex justify-center space-x-24 items-start">
            <div id="buy-me-a-coffee-qr" class="w-32 h-40">
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
                    height="128"
                />
            </div>
        </div>
    </div>

</div>