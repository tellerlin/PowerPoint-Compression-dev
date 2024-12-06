<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Events } from '$lib/types/events';


    const dispatch = createEventDispatcher<{
        fileSelected: Events.FileSelectedEvent;
    }>();
    
    let isDragging = false;
    
    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        isDragging = true;
    }
    
    function handleDragLeave() {
        isDragging = false;
    }
    
    function handleDrop(e: DragEvent) {
        e.preventDefault();
        isDragging = false;
        const files = e.dataTransfer?.files;
        if (files?.length) handleFile(files[0]);
    }
    
    function handleFileInput(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files?.length) handleFile(input.files[0]);
    }
    
    function handleFile(file: File) {
        if (!file.name.toLowerCase().endsWith('.pptx')) {
            alert('Please upload a PowerPoint (.pptx) file');
            return;
        }
        dispatch('fileSelected', { file });
    }
</script>


<button
    type="button"
    class="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center {isDragging
        ? 'bg-primary/10 border-primary'
        : 'bg-background-alt'}"
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
    />
    <label
        for="fileInput"
        class="cursor-pointer inline-flex flex-col items-center gap-4"
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
            Drag & drop your PowerPoint file here <br />
            or <span class="text-primary">browse</span>
        </div>
    </label>
</button>