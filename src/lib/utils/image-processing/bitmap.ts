/**
 * Utility functions for creating and managing ImageBitmap objects
 */

/**
 * Create an ImageBitmap from a Blob or ArrayBuffer
 * @param data Image data as Blob or ArrayBuffer
 * @returns Promise resolving to ImageBitmap
 */
export async function createImageBitmap(data: Blob | ArrayBuffer): Promise<ImageBitmap> {
    if (data instanceof ArrayBuffer) {
        data = new Blob([data]);
    }
    return globalThis.createImageBitmap(data);
}
