<script lang="ts">  
    import { browser } from '$app/environment';  
    import FileUpload from '$lib/components/FileUpload.svelte';  
    import ProgressBar from '$lib/components/ProgressBar.svelte';  
    import CompressionResults from '$lib/components/CompressionResults.svelte';  
    import FAQ from '$lib/components/FAQ.svelte';
    import { compressPPTX } from '$lib/utils/compression';  
    import { compressionProgress, compressionResult } from '$lib/stores/compression';  
    import type { Events } from '$lib/types/events';  
    import { onMount } from 'svelte';  

    let errorMessage = '';  
    let originalFileName = '';
    let showResults = false;

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "How do I compress a PowerPoint file?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Simply drag and drop your PowerPoint file onto our tool or click to browse. The compression starts automatically and maintains your presentation's quality while reducing file size."
            }
        }, {
            "@type": "Question",
            "name": "Will compression affect my presentation quality?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "No, our smart compression algorithm preserves the visual quality of your presentation while optimizing file size through advanced image compression and unused media removal."
            }
        }, {
            "@type": "Question",
            "name": "Is there a file size limit?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, the maximum file size is 300MB. For larger files, we recommend splitting your presentation into smaller parts."
            }
        }, {
            "@type": "Question",
            "name": "How secure is the compression process?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Your files are processed entirely in your browser. No data is uploaded to our servers, ensuring complete privacy and security of your content."
            }
        }]
    };

    async function handleFileSelected(event: CustomEvent<Events.FileSelectedEvent>) {  
        if (!browser) return;  

        const file = event.detail.file;  
        originalFileName = file.name;
        errorMessage = '';  
        showResults = false;

        compressionProgress.set({ progress: 0, status: 'Starting compression...' });  
        compressionResult.set({ originalSize: 0, compressedSize: 0, downloadUrl: '' });  

        try {  
            const compressed = await compressPPTX(file, (progress) => {  
                compressionProgress.set(progress);  
            });  

            if (browser) {  
                const downloadUrl = URL.createObjectURL(compressed);  
                compressionResult.set({  
                    originalSize: file.size,  
                    compressedSize: compressed.size,  
                    downloadUrl  
                });
                showResults = true;
            }  
        } catch (error) {  
            errorMessage = error instanceof Error ? error.message : 'Compression failed';  
            compressionProgress.set({ progress: 0, status: '' });  
        }  
    }  

    onMount(() => {  
        return () => {  
            const { downloadUrl } = $compressionResult;  
            if (downloadUrl) URL.revokeObjectURL(downloadUrl);  
        };  
    });  
</script>  

<svelte:head>
    <title>Free PowerPoint Compression Tool | Reduce PPT File Size Online</title>
    <meta name="description" content="Compress PowerPoint presentations online without losing quality. Reduce PPT file size up to 90% for easy sharing. Free, secure, and no installation required.">
    <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
    </script>
</svelte:head>

<div class="min-h-screen bg-background">  
    <div class="container mx-auto px-4 py-12">  
        <div class="max-w-3xl mx-auto">  
            <h1 class="text-4xl font-bold text-center mb-6 text-primary">
                PowerPoint Compression Tool: Reduce File Size Without Quality Loss
            </h1>

            <div class="prose dark:prose-invert max-w-none mb-8">
                <p class="text-lg text-center mb-6">
                    Efficiently compress your PowerPoint presentations while maintaining high quality. 
                    Perfect for sharing via email or uploading to websites.
                </p>
            </div>

            {#if browser}  
                <FileUpload on:fileSelected={handleFileSelected} />  
                
                {#if $compressionProgress.progress > 0 && !showResults}
                    <ProgressBar   
                        progress={$compressionProgress.progress}   
                        status={$compressionProgress.status}   
                    />  
                {/if}

                {#if errorMessage}  
                    <div class="text-red-500 mt-4">{errorMessage}</div>  
                {/if}  

                {#if showResults}
                    <CompressionResults  
                        originalSize={$compressionResult.originalSize}  
                        compressedSize={$compressionResult.compressedSize}  
                        downloadUrl={$compressionResult.downloadUrl}  
                        originalFileName={originalFileName}
                    />  
                {/if}
            {/if}  

            <FAQ />
        </div>  
    </div>  
</div>