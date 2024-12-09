<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Events } from '$lib/types/events';
    import { validateFile } from '$lib/utils/validation';

    const dispatch = createEventDispatcher<{
        fileSelected: Events.FileSelectedEvent;
    }>();
    
    let isDragging = false;
    let isProcessing = false;
    
    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        isDragging = true;
    };
    
    const handleDragLeave = () => isDragging = false;
    
    const handleDrop = async (e: DragEvent) => {
        e.preventDefault();
        isDragging = false;
        const file = e.dataTransfer?.files?.[0];
        if (file) await handleFile(file);
    };
    
    const handleFileInput = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) await handleFile(file);
    };
    
    const handleFile = async (file: File) => {
        if (isProcessing) return;
        
        const error = validateFile(file);
        if (error) {
            alert(error);
            return;
        }

        isProcessing = true;
        try {
            const blobUrl = URL.createObjectURL(file);
            dispatch('fileSelected', { file, blobUrl });
        } finally {
            isProcessing = false;
        }
    };
</script>

<div
    class="w-full border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 
           {isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 bg-background-alt hover:border-primary/50'} 
           {isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
>
    <input
        type="file"
        accept=".pptx"
        class="hidden"
        id="fileInput"
        on:change={handleFileInput}
        disabled={isProcessing}
    />
    <label
        for="fileInput"
        class="cursor-pointer inline-flex flex-col items-center gap-4 {isProcessing ? 'pointer-events-none' : ''}"
    >
        <svg
            class="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
        </svg>
        <div class="text-lg">
            {#if isProcessing}
                Processing...
            {:else}
                Drag & drop your PowerPoint file here <br />
                or <span class="text-primary">browse</span>
            {/if}
        </div>
        <div class="text-sm text-gray-500">
            Maximum file size: 100MB
        </div>
    </label>
</div>