<script lang="ts">  
    export let originalSize = 0;  
    export let compressedSize = 0;  
    export let downloadUrl = '';  
    export let originalFileName = '';  

    function formatSize(bytes: number): string {  
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;  
    }  

    $: downloadFileName = computeDownloadFileName(downloadUrl, originalFileName);  

    function computeDownloadFileName(downloadUrl: string, originalFileName: string): string | undefined {  
        if (!downloadUrl || !originalFileName) return undefined;  

        const lastDotIndex = originalFileName.lastIndexOf('.');  
        const nameWithoutExtension = lastDotIndex !== -1 ? originalFileName.substring(0, lastDotIndex) : originalFileName;  

        let fileNamePart: string;  
        if (nameWithoutExtension.length <= 20) {  
            const extension = lastDotIndex !== -1 ? originalFileName.substring(lastDotIndex) : '.pptx';  
            fileNamePart = `${nameWithoutExtension}_zip${extension}`;  
        } else {  
            const truncatedName = nameWithoutExtension.substring(0, 20);  
            fileNamePart = `${truncatedName}_zip.pptx`;  
        }  

        return fileNamePart;  
    }  
</script>  

{#if downloadUrl}  
    <div class="mt-8 p-6 bg-background-alt rounded-lg">  
        <h2 class="text-xl font-semibold mb-4">Compression Results</h2>  
        <div class="grid grid-cols-2 gap-4 mb-6">  
            <div>  
                <p class="text-sm text-text-light">Original Size</p>  
                <p class="text-lg font-medium">{formatSize(originalSize)}</p>  
            </div>  
            <div>  
                <p class="text-sm text-text-light">Compressed Size</p>  
                <p class="text-lg font-medium">{formatSize(compressedSize)}</p>  
            </div>  
        </div>  
        <a  
            href={downloadUrl}  
            download={downloadFileName}  
            class="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors"  
        >  
            Download Compressed File  
        </a>  
        <p>Download Filename: {downloadFileName}</p> <!-- 调试输出 -->  
    </div>  
{/if}