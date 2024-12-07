<script lang="ts">  
    import { browser } from '$app/environment';  
    import FileUpload from '$lib/components/FileUpload.svelte';  
    import ProgressBar from '$lib/components/ProgressBar.svelte';  
    import CompressionResults from '$lib/components/CompressionResults.svelte';  
    import { compressPPTX } from '$lib/utils/compression';  
    import { compressionProgress, compressionResult } from '$lib/stores/compression';  
    import type { Events } from '$lib/types/events';  
    import { onMount } from 'svelte';  

    let errorMessage = '';  
    let originalFileName = ''; // 新增：存储原始文件名  

    async function handleFileSelected(event: CustomEvent<Events.FileSelectedEvent>) {  
        if (!browser) return;  

        const file = event.detail.file;  
        originalFileName = file.name; // 设置原始文件名  
        errorMessage = '';  

        compressionProgress.set({ progress: 0, status: 'Starting compression...' });  
        compressionResult.set({ originalSize: 0, compressedSize: 0, downloadUrl: '' });  

        try {  
            const compressed = await compressPPTX(file, (progress) => {  
                compressionProgress.set({  
                    progress,  
                    status: `Compressing... ${progress}%`  
                });  
            });  

            if (browser) {  
                const downloadUrl = URL.createObjectURL(compressed);  
                compressionResult.set({  
                    originalSize: file.size,  
                    compressedSize: compressed.size,  
                    downloadUrl  
                });  
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

<div class="min-h-screen bg-background">  
    <div class="container mx-auto px-4 py-12">  
        <div class="max-w-3xl mx-auto">  
            <h1 class="text-4xl font-bold text-center mb-8 text-primary">  
                PowerPoint Compression Tool  
            </h1>  

            {#if browser}  
                <FileUpload on:fileSelected={handleFileSelected} />  
                <ProgressBar   
                    progress={$compressionProgress.progress}   
                    status={$compressionProgress.status}   
                />  

                {#if errorMessage}  
                    <div class="text-red-500 mt-4">{errorMessage}</div>  
                {/if}  

                <CompressionResults  
                    originalSize={$compressionResult.originalSize}  
                    compressedSize={$compressionResult.compressedSize}  
                    downloadUrl={$compressionResult.downloadUrl}  
                    originalFileName={originalFileName}
                />  
            {/if}  
        </div>  
    </div>  
</div>  
