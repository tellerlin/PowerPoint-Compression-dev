export interface ImageDimensions {
    width: number;
    height: number;
}

export function calculateOptimalDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth = 1366,
    maxHeight = 768
): ImageDimensions {
    let width = originalWidth;
    let height = originalHeight;

    if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
    }

    if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
    }

    return { width, height };
}

export async function resizeImage(
    bitmap: ImageBitmap,
    targetWidth: number,
    targetHeight: number
): Promise<OffscreenCanvas> {
    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    return canvas;
}