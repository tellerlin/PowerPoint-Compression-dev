<script>
    import { goto } from '$app/navigation';
</script>


<svelte:head>
    <title>Page Not Found - ByteSlim</title>
</svelte:head>


<div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="text-center">
        <h1 class="text-6xl font-bold text-blue-500 mb-4">404</h1>
        <p class="text-2xl mb-6">Oops! Page Not Found</p>
        <p class="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="flex justify-center space-x-4">
            <button 
                class="btn btn-primary"
                on:click={() => goto('/')}
            >
                Back to Home
            </button>
            <button 
                class="btn btn-secondary"
                on:click={() => goto('/contact')}
            >
                Contact Support
            </button>
        </div>
    </div>
</div>