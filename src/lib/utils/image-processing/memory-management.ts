export interface MemoryStats {
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
}

export async function checkMemoryUsage(threshold: number): Promise<void> {
    if (typeof performance === 'undefined' || !performance.memory) {
        return;
    }

    const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
    if (memoryUsage > threshold) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

export function cleanupImageResources(
    bitmap: ImageBitmap,
    canvas: OffscreenCanvas
): void {
    try {
        bitmap.close();
        canvas.width = 0;
        canvas.height = 0;
    } catch (error) {
        console.warn('Failed to cleanup image resources:', error);
    }
}