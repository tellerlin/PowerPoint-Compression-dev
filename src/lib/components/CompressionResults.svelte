<script lang="ts">  
    export let originalSize = 0;  
    export let compressedSize = 0;  
    export let downloadUrl = '';  
    export let originalFileName = '';  // 新增：接收原始文件名  

    function formatSize(bytes: number): string {  
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;  
    }  

    let downloadFileName: string;  // 用于存储下载文件名  

    if (downloadUrl) {  
        // 获取文件名不含扩展名的部分  
        const lastDotIndex = originalFileName.lastIndexOf('.');  
        let nameWithoutExtension: string;  

        if (lastDotIndex !== -1) {  
            nameWithoutExtension = originalFileName.substring(0, lastDotIndex);  
        } else {  
            nameWithoutExtension = originalFileName;  
        }  

        // 检查文件名长度并生成下载文件名  
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
        <a  
            href={downloadUrl}  
            download={downloadFileName}  <!-- 绑定下载文件名 -->  
            class="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors"  
        >  
            Download Compressed File  
        </a>  
    </div>  
{/if}