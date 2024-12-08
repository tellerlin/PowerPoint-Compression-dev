<script>
    import { page } from '$app/stores';
</script>


<svelte:head>
    <title>{$page.status || 404} - Page Not Found</title>
    <meta name="description" content="Error page for ByteSlim">
</svelte:head>


<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
    <div class="text-center bg-white p-8 rounded-xl shadow-2xl">
        <h1 class="text-6xl font-bold text-blue-500 mb-4 animate-bounce">
            {$page.status || 404}
        </h1>
        <p class="text-2xl mb-6 font-semibold">
            {$page.status === 404 
                ? 'Oops! Page Not Found' 
                : 'An unexpected error occurred'}
        </p>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
            {$page.status === 404 
                ? 'The page you\'re looking for doesn\'t exist or has been moved.' 
                : 'Please try again later or contact support.'}
        </p>
        <div class="flex justify-center space-x-4">
            <a 
                href="/" 
                class="btn btn-primary px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
                Back to Home
            </a>
            <a 
                href="/contact" 
                class="btn btn-secondary px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
                Contact Support
            </a>
        </div>
    </div>
</div>


<style>
    .btn {
        @apply transform transition-all duration-300 hover:-translate-y-1;
    }
</style>