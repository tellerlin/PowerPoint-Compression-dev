export async function onRequest(context) {
    try {
        const { request, next } = context;
        return await next();
    } catch (error) {
        console.error('Rendering error:', error);
        return new Response(`An error occurred: ${error.message}`, { 
            status: 500,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
}