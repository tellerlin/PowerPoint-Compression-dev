<script>
    export const prerender = true;
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';


    let showAnimation = false;


    // Delay animation on component mount
    onMount(() => {
        setTimeout(() => {
            showAnimation = true;
        }, 100);
    });


    $: status = $page.status || 404;
    $: errorMessage = $page.error?.message || 'The webpage you are looking for might have been removed, had its name changed, or is temporarily unavailable.';
</script>


<svelte:head>
    <title>{status} - Page Not Found | ByteSlim</title>
    <meta name="description" content="Oops! The page you're looking for cannot be found.">
</svelte:head>


<div 
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 transition-all duration-500 ease-in-out"
>
    <div 
        class="text-center p-8 rounded-xl shadow-2xl bg-white transform transition-all duration-700 {showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}"
    >
        <h1 
            class="text-7xl font-bold text-blue-500 mb-4 animate-bounce"
        >
            {status}
        </h1>
        <p class="text-2xl mb-6 text-gray-800 font-semibold">
            {status === 404 ? 'Whoops! Page Not Found' : 'An Error Occurred'}
        </p>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
            {errorMessage}
        </p>
        <div class="flex justify-center space-x-4">
            <button 
                class="btn btn-primary px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-blue-500 text-white hover:bg-blue-600"
                on:click={() => goto('/')}
            >
                Return to Home
            </button>
            <button 
                class="btn btn-secondary px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-gray-500 text-white hover:bg-gray-600"
                on:click={() => goto('/contact')}
            >
                Contact Support
            </button>
        </div>
    </div>
</div>


<style>
    .btn {
        @apply transform transition-all duration-300 hover:-translate-y-1;
    }
</style>