<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';


    // 获取错误信息
    $: status = $page.status || 404;
    $: error = $page.error;


    // 错误类型映射
    const errorMessages = {
        404: {
            title: 'Page Not Found',
            description: 'The page you\'re looking for doesn\'t exist or has been moved.'
        },
        500: {
            title: 'Internal Server Error',
            description: 'Something went wrong on our end. Please try again later.'
        },
        403: {
            title: 'Access Forbidden',
            description: 'You do not have permission to access this page.'
        }
    };


    // 获取当前错误的具体信息
    $: currentError = errorMessages[status] || {
        title: 'Unexpected Error',
        description: 'An unexpected error occurred.'
    };
</script>


<svelte:head>
    <title>{status} - {currentError.title}</title>
    <meta name="description" content="{currentError.description}">
</svelte:head>


<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
    <div class="text-center bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <h1 class="text-6xl font-bold text-blue-500 mb-4 animate-bounce">
            {status}
        </h1>
        <p class="text-2xl mb-6 font-semibold text-gray-800">
            {currentError.title}
        </p>
        <p class="text-gray-600 mb-8">
            {currentError.description}
        </p>
        
        <!-- 可选的错误详情 -->
        {#if error && error.message}
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p class="text-sm">{error.message}</p>
            </div>
        {/if}


        <div class="flex justify-center space-x-4">
            <button 
                class="btn btn-primary px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                on:click={() => goto('/')}
            >
                Back to Home
            </button>
            <button 
                class="btn btn-secondary px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
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