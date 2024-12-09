<script lang="ts">
    export let progress = 0;
    export let status = '';

    $: progressWidth = `${Math.min(Math.max(progress, 0), 100)}%`;
</script>

<div class="mt-8 animate-fade-in">
    <div class="mb-2 flex justify-between items-center">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{status}</span>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
            class="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style="width: {progressWidth}"
        >
            <div class="h-full w-full bg-primary animate-pulse"></div>
        </div>
    </div>
</div>

<style>
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
</style>