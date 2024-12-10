<script>
    const currentYear = new Date().getFullYear();
</script>

<footer aria-label="Site Footer" class="bg-gray-100 dark:bg-gray-800 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-8">
            <div>
                <h3 class="text-lg font-semibold mb-4">Navigation</h3>
                <ul class="space-y-2">
                    <li><a href="/" class="text-gray-500 hover:text-blue-500">Home</a></li>
                    <li><a href="/about" class="text-gray-500 hover:text-blue-500">About</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-4">Legal</h3>
                <ul class="space-y-2">
                    <li><a href="/privacy" class="text-gray-500 hover:text-blue-500">Privacy Policy</a></li>
                    <li><a href="/sitemap" class="text-gray-500 hover:text-blue-500">Sitemap</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-4">Connect</h3>
                <ul class="space-y-2">
                    <li><a href="/contact" class="text-gray-500 hover:text-blue-500">Contact Us</a></li>
                </ul>
            </div>
        </div>
        <div class="mt-8 text-center text-gray-500">
            © {currentYear} ByteSlim. All rights reserved.
        </div>
    </div>
</footer>