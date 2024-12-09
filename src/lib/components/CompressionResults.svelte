<script lang="ts">  
    export let originalSize = 0;  
    export let compressedSize = 0;  
    export let downloadUrl = '';  
    export let originalFileName = '';  

    function formatSize(bytes: number): string {  
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;  
    }  

    function calculateReduction(original: number, compressed: number): string {
        const reduction = ((original - compressed) / original) * 100;
        return `${reduction.toFixed(1)}%`;
    }

    $: downloadFileName = computeDownloadFileName(downloadUrl, originalFileName);  
    $: reductionPercentage = calculateReduction(originalSize, compressedSize);

    function computeDownloadFileName(downloadUrl: string, originalFileName: string): string | undefined {  
        if (!downloadUrl || !originalFileName) return undefined;  

        const lastDotIndex = originalFileName.lastIndexOf('.');  
        const nameWithoutExtension = lastDotIndex !== -1 ? originalFileName.substring(0, lastDotIndex) : originalFileName;  
        const extension = lastDotIndex !== -1 ? originalFileName.substring(lastDotIndex) : '.pptx';  

        return `${nameWithoutExtension}_compressed${extension}`;  
    }  
</script>  

{#if downloadUrl}  
    <div class="mt-8 p-6 bg-background-alt rounded-lg shadow-lg animate-fade-in">  
        <h2 class="text-xl font-semibold mb-4">Compression Complete!</h2>  
        <div class="grid grid-cols-3 gap-4 mb-6">  
            <div class="text-center">  
                <p class="text-sm text-text-light">Original Size</p>  
                <p class="text-lg font-medium">{formatSize(originalSize)}</p>  
            </div>  
            <div class="text-center">  
                <p class="text-sm text-text-light">Compressed Size</p>  
                <p class="text-lg font-medium">{formatSize(compressedSize)}</p>  
            </div>  
            <div class="text-center">  
                <p class="text-sm text-text-light">Reduction</p>  
                <p class="text-lg font-medium text-success-500">{reductionPercentage}</p>  
            </div>
        </div>  
        <div class="flex justify-center">
            <a  
                href={downloadUrl}  
                download={downloadFileName}  
                class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
            >  
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Compressed File
            </a>  
        </div>
    </div>  
{/if}

<style>
    .animate-fade-in {
        animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>