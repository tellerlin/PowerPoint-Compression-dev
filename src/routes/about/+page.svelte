<script>
    import { page } from '$app/stores';

    const features = [
        {
            title: "Smart Compression",
            description: "Our advanced algorithms intelligently optimize images and remove unused media to significantly reduce file size while preserving the visual quality of your presentations.",
            icon: "🚀"
        },
        {
            title: "Privacy First",
            description: "Security is our priority. All file processing happens directly in your browser - your presentations never leave your device, ensuring complete confidentiality.",
            icon: "🔒"
        },
        {
            title: "Quality Preserved",
            description: "Experience up to 90% file size reduction while maintaining the professional look of your presentations. Perfect for sharing via email or uploading to platforms.",
            icon: "✨"
        }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "About ByteSlim - PowerPoint Compression Tool",
        "description": "Learn how ByteSlim's advanced compression technology helps reduce PowerPoint file sizes while maintaining quality. Discover our commitment to privacy and security.",
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
    <title>About ByteSlim | Advanced PowerPoint Compression Technology</title>
    <meta name="description" content="Discover how ByteSlim's innovative compression technology reduces PowerPoint file sizes while maintaining quality. Learn about our privacy-first approach and commitment to security.">
    <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
    </script>
</svelte:head>

<div class="bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <h1 class="text-4xl font-bold text-center mb-8">
            Advanced PowerPoint Compression Technology
        </h1>
        
        <div class="max-w-3xl mx-auto">
            <p class="text-xl text-gray-600 dark:text-gray-300 text-center mb-12">
                ByteSlim revolutionizes PowerPoint compression with technology that intelligently reduces file size while preserving the quality and professionalism of your presentations.
            </p>

            <div class="grid gap-8 mb-16">
                {#each features as feature}
                    <div class="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                        <div class="text-4xl mb-4">{feature.icon}</div>
                        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {feature.title}
                        </h2>
                        <p class="text-gray-600 dark:text-gray-300 text-lg">
                            {feature.description}
                        </p>
                    </div>
                {/each}
            </div>

            <div class="prose dark:prose-invert max-w-none">
                <h2 class="text-2xl font-bold mb-6">How It Works</h2>
                <p class="mb-4">
                    ByteSlim uses advanced compression algorithms to analyze and optimize your PowerPoint presentations. Our technology identifies and compresses images, removes unused media, and optimizes the overall file structure without compromising quality.
                </p>
                <p class="mb-4">
                    Unlike traditional compression tools, ByteSlim processes everything locally in your browser, ensuring your sensitive presentation content never leaves your device. This approach combines maximum security with optimal compression results.
                </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center mt-16">
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
    </div>
</div>