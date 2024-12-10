<script>
    const faqs = [
        {
            question: "How do I compress a PowerPoint file?",
            answer: "Simply drag and drop your PowerPoint file onto our tool or click to browse. The compression starts automatically and maintains your presentation's quality while reducing file size."
        },
        {
            question: "What compression options are available?",
            answer: "Our tool automatically selects the best compression settings for your presentation, optimizing images and removing unused media while preserving quality."
        },
        {
            question: "Will compression affect my presentation quality?",
            answer: "No, our smart compression algorithm preserves the visual quality of your presentation while optimizing file size through advanced image compression and unused media removal."
        },
        {
            question: "Is there a file size limit?",
            answer: "Yes, the maximum file size is 300MB. For larger files, we recommend splitting your presentation into smaller parts."
        },
        {
            question: "How secure is the compression process?",
            answer: "Your files are processed entirely in your browser. No data is uploaded to our servers, ensuring complete privacy and security of your content."
        },
        {
            question: "Can I compress multiple files at once?",
            answer: "Currently, we support compressing one file at a time to ensure optimal compression quality for each presentation."
        }
    ];
</script>

<section class="mt-16">
    <h2 class="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
    <div class="space-y-4">
        {#each faqs as faq}
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-2">{faq.question}</h3>
                <p class="text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </div>
        {/each}
    </div>
</section>