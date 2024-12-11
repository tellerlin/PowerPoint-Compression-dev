<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Events } from '$lib/types/events';
    import { validateFile } from '$lib/utils/validation';

    const dispatch = createEventDispatcher<{
        fileSelected: Events.FileSelectedEvent;
        error: string;
    }>();
    
    let isDragging = false;
    let isProcessing = false;
    let errorMessage = '';
    let inputElement: HTMLInputElement;
    
    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        isDragging = true;
    };
    
    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        // Only set isDragging to false if we're leaving the dropzone
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        if (
            e.clientX <= rect.left ||
            e.clientX >= rect.right ||
            e.clientY <= rect.top ||
            e.clientY >= rect.bottom
        ) {
            isDragging = false;
        }
    };
    
    const handleDrop = async (e: DragEvent) => {
        e.preventDefault();
        isDragging = false;
        errorMessage = '';
        
        const files = Array.from(e.dataTransfer?.files || []);
        if (files.length > 1) {
            errorMessage = 'Please upload only one file at a time';
            dispatch('error', errorMessage);
            return;
        }
        
        const file = files[0];
        if (file) await handleFile(file);
    };
    
    const handleFileInput = async (e: Event) => {
        errorMessage = '';
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) await handleFile(file);
    };
    
    const handleFile = async (file: File) => {
        if (isProcessing) return;
        
        const error = validateFile(file);
        if (error) {
            errorMessage = error;
            dispatch('error', error);
            // Reset the input
            if (inputElement) inputElement.value = '';
            return;
        }

        isProcessing = true;
        errorMessage = '';
        
        try {
            const blobUrl = URL.createObjectURL(file);
            dispatch('fileSelected', { file, blobUrl });
        } catch (error) {
            errorMessage = 'Failed to process file';
            dispatch('error', errorMessage);
        } finally {
            isProcessing = false;
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputElement?.click();
        }
    };
</script>

<div
    class="relative w-full border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 
           {isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 bg-background-alt hover:border-primary/50'} 
           {isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    role="button"
    tabindex="0"
    on:keydown={handleKeyDown}
    aria-label="Upload PowerPoint file"
    aria-describedby="fileUploadDescription"
>
    <input
        bind:this={inputElement}
        type="file"
        accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        class="hidden"
        id="fileInput"
        on:change={handleFileInput}
        disabled={isProcessing}
        aria-label="Choose PowerPoint file"
    />
    <label
        for="fileInput"
        class="cursor-pointer inline-flex flex-col items-center gap-4 {isProcessing ? 'pointer-events-none' : ''}"
    >
        {#if isProcessing}
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
        {:else}
            <svg
                class="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
            </svg>
        {/if}
        
        <div class="text-lg" id="fileUploadDescription">
            {#if isProcessing}
                <span class="text-primary">Processing your file...</span>
            {:else}
                Drag & drop your PowerPoint file here <br />
                or <span class="text-primary hover:underline">browse</span>
            {/if}
        </div>
        <div class="text-sm text-gray-500">
            Maximum file size: 300MB
        </div>
    </label>

    {#if errorMessage}
        <div 
            class="absolute bottom-0 left-0 right-0 p-3 bg-red-100 text-red-700 rounded-b-lg text-sm"
            role="alert"
        >
            {errorMessage}
        </div>
    {/if}
</div>

<style>
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .animate-spin {
        animation: spin 1s linear infinite;
    }
</style>