<script>
    import { page } from '$app/stores';
    import logo from '$lib/images/byteslim-logo.svg';




    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' }
    ];




    function getAriaCurrent(path) {
        return $page.url.pathname === path ? 'page' : undefined;
    }
</script>




<svelte:head>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
    <link rel="icon" href="/favicon.ico?v=2">
</svelte:head>




<header>
    <div class="corner">
        <a href="/" aria-label="Home">
            <img 
                src={logo} 
                alt="Byteslim Logo" 
                width="32" 
                height="32" 
                loading="lazy"
            />
        </a>
    </div>




    <nav aria-label="Main Navigation">
        <svg viewBox="0 0 2 3" aria-hidden="true">
            <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
        </svg>




        <ul>
            {#each navItems as item}
                <li aria-current={getAriaCurrent(item.href)}>
                    <a href={item.href}>{item.label}</a>
                </li>
            {/each}
        </ul>




        <svg viewBox="0 0 2 3" aria-hidden="true">
            <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
        </svg>
    </nav>
</header>




<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
    }




    .corner {
        width: 3em;
        height: 3em;
    }




    .corner a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }




    .corner img {
        width: 2em;
        height: 2em;
        object-fit: contain;
        transition: transform 0.2s ease;
    }




    .corner img:hover {
        transform: scale(1.1);
    }




    nav {
        display: flex;
        justify-content: center;
        align-items: center;
        --background: rgba(50, 50, 50, 0.9);
    }




    svg {
        width: 2em;
        height: 3em;
        display: block;
    }




    path {
        fill: var(--background);
    }




    ul {
        position: relative;
        padding: 0;
        margin: 0;
        height: 3em;
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        background: var(--background);
        background-size: contain;
    }




    li {
        position: relative;
        height: 100%;
    }




    li[aria-current='page']::before {
        --size: 6px;
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: calc(50% - var(--size));
        border: var(--size) solid transparent;
        border-top: var(--size) solid var(--color-theme-1);
    }




    nav a {
        display: flex;
        height: 100%;
        align-items: center;
        padding: 0 0.5rem;
        color: white;
        font-weight: 700;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-decoration: none;
        transition: 
            color 0.2s linear,
            background-color 0.2s ease;
    }




    a:hover {
        color: var(--color-theme-1);
        background-color: rgba(255,255,255,0.1);
    }




    @media (max-width: 600px) {
        header {
            flex-direction: column;
            padding: 0.5rem;
        }




        nav {
            width: 100%;
        }




        ul {
            width: 100%;
            justify-content: space-around;
        }
    }
</style>