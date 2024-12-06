export async function handle({ event, resolve }) {
    try {
        return await resolve(event);
    } catch (error) {
        console.error('SvelteKit handle error:', error);
        return new Response(`An error occurred: ${error.message}`, { 
            status: 500,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
}