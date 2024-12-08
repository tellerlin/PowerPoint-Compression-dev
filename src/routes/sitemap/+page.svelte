<script>  
    const sitemapLinks = [  
        { name: 'Home', url: '/' },  
        { name: 'About', url: '/about' },  
        { name: 'Privacy', url: '/privacy' },  
        { name: 'Contact', url: '/contact' }  
    ];  
</script>  

<svelte:head>  
    <title>ByteSlim - Site Map</title>  
    <meta name="description" content="Complete site map for ByteSlim">  
</svelte:head>  

<div class="mx-auto max-w-7xl px-4 py-8">  
    <h1 class="text-3xl font-bold mb-6 text-center">Site Map</h1>  
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">  
        {#each sitemapLinks as link}  
            <a   
                href={link.url}   
                class="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition   
                       text-gray-800 hover:text-blue-600 font-semibold   
                       border border-gray-200 hover:border-blue-300  
                       text-center"  
            >  
                {link.name}  
            </a>  
        {/each}  
    </div>  
</div>