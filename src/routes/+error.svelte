<script>
    export const prerender = true;
    import { page } from '$app/stores';
</script>


<svelte:head>
    <title>Page Not Found - ByteSlim</title>
</svelte:head>


<div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="text-center">
        <h1 class="text-6xl font-bold text-blue-500 mb-4">
            {$page.status || 404}
        </h1>
        <p class="text-2xl mb-6">
            {$page.status === 404 
                ? 'Oops! Page Not Found' 
                : 'An unexpected error occurred'}
        </p>
        <p class="text-gray-600 mb-8">
            {$page.status === 404 
                ? 'The page you\'re looking for doesn\'t exist or has been moved.' 
                : 'Please try again later or contact support.'}
        </p>
        <div class="flex justify-center space-x-4">
            <a 
                href="/" 
                class="btn btn-primary"
            >
                Back to Home
            </a>
            <a 
                href="/contact" 
                class="btn btn-secondary"
            >
                Contact Support
            </a>
        </div>
    </div>
</div>