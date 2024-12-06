<script lang="ts">  
    export let originalSize = 0;  
    export let compressedSize = 0;  
    export let downloadUrl = '';  
    export let originalFileName = '';  // Receive original filename as a prop  

    function formatSize(bytes: number): string {  
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;  
    }  

    let downloadFileName: string;  // To store the download filename  

    if (downloadUrl) {  
        // Get the part of the filename without the extension  
        const lastDotIndex = originalFileName.lastIndexOf('.');  
        let nameWithoutExtension: string;  

        if (lastDotIndex !== -1) {  
            nameWithoutExtension = originalFileName.substring(0, lastDotIndex);  
        } else {  
            nameWithoutExtension = originalFileName;  
        }  

        // Check filename length and generate download filename accordingly  
        if (nameWithoutExtension.length <= 20) {  
            downloadFileName = originalFileName;  
        } else {  
            const truncatedName = nameWithoutExtension.substring(0, 20);  
            downloadFileName = `${truncatedName}-zip.pptx`;  
        }  
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
        <!-- Download link with dynamically set filename -->  
        <a  
            href={downloadUrl}  
            download={downloadFileName}  
            class="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors"  
        >  
            Download Compressed File  
        </a>  
    </div>  
{/if}