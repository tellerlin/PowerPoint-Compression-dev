import { IMAGE_CONSTANTS } from './constants';
import type { ImageAnalysis } from './format-detection';

interface OptimizationResult {
    data: Uint8Array;
    format: string;
    quality: number;
}

export async function optimizeImage(
    imageData: ArrayBuffer,
    analysis: ImageAnalysis
): Promise<OptimizationResult> {
    const blob = new Blob([imageData]);
    const bitmap = await createImageBitmap(blob);
    
    const { width, height } = calculateDimensions(bitmap.width, bitmap.height);
    const canvas = await createOptimizedCanvas(bitmap, width, height);
    
    const result = analysis.hasAlpha
        ? await optimizeWithAlpha(canvas)
        : await optimizeWithoutAlpha(canvas);
        
    return result;
}

function calculateDimensions(
    width: number,
    height: number
): { width: number; height: number } {
    const { MAX_DIMENSION } = IMAGE_CONSTANTS;
    const ratio = Math.min(
        MAX_DIMENSION.WIDTH / width,
        MAX_DIMENSION.HEIGHT / height
    );
    
    return ratio < 1
        ? {
            width: Math.round(width * ratio),
            height: Math.round(height * ratio)
        }
        : { width, height };
}

async function createOptimizedCanvas(
    bitmap: ImageBitmap,
    width: number,
    height: number
): Promise<OffscreenCanvas> {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }
    
    ctx.drawImage(bitmap, 0, 0, width, height);
    return canvas;
}

async function optimizeWithAlpha(
    canvas: OffscreenCanvas
): Promise<OptimizationResult> {
    const { WEBP, JPEG } = IMAGE_CONSTANTS.FORMATS;
    const { DEFAULT } = IMAGE_CONSTANTS.QUALITY;
    
    const blob = await canvas.convertToBlob({
        type: WEBP,
        quality: DEFAULT
    });
    
    return {
        data: new Uint8Array(await blob.arrayBuffer()),
        format: WEBP,
        quality: DEFAULT
    };
}

async function optimizeWithoutAlpha(
    canvas: OffscreenCanvas
): Promise<OptimizationResult> {
    const { WEBP, JPEG } = IMAGE_CONSTANTS.FORMATS;
    const { DEFAULT } = IMAGE_CONSTANTS.QUALITY;
    
    const [webpBlob, jpegBlob] = await Promise.all([
        canvas.convertToBlob({ type: WEBP, quality: DEFAULT }),
        canvas.convertToBlob({ type: JPEG, quality: DEFAULT })
    ]);
    
    const [webpBuffer, jpegBuffer] = await Promise.all([
        webpBlob.arrayBuffer(),
        jpegBlob.arrayBuffer()
    ]);
    
    return webpBuffer.byteLength <= jpegBuffer.byteLength
        ? {
            data: new Uint8Array(webpBuffer),
            format: WEBP,
            quality: DEFAULT
        }
        : {
            data: new Uint8Array(jpegBuffer),
            format: JPEG,
            quality: DEFAULT
        };
}