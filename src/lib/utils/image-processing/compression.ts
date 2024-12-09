import type { ImageAnalysis } from './format-detection';
import { calculateOptimalDimensions, resizeImage } from './resize';

interface CompressionResult {
    data: Uint8Array;
    format: string;
}

export async function compressImage(
    originalData: ArrayBuffer,
    analysis: ImageAnalysis
): Promise<CompressionResult> {
    const blob = new Blob([originalData]);
    const bitmap = await createImageBitmap(blob);
    
    const { width, height } = calculateOptimalDimensions(bitmap.width, bitmap.height);
    const canvas = await resizeImage(bitmap, width, height);

    if (analysis.hasAlpha) {
        return await compressWithAlpha(canvas);
    }
    
    return await compressWithoutAlpha(canvas);
}

async function compressWithAlpha(canvas: OffscreenCanvas): Promise<CompressionResult> {
    const blob = await canvas.convertToBlob({ 
        type: 'image/webp', 
        quality: 0.8 
    });
    
    return {
        data: new Uint8Array(await blob.arrayBuffer()),
        format: 'webp'
    };
}

async function compressWithoutAlpha(canvas: OffscreenCanvas): Promise<CompressionResult> {
    const [webpBlob, jpegBlob] = await Promise.all([
        canvas.convertToBlob({ type: 'image/webp', quality: 0.8 }),
        canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 })
    ]);

    const [webpBuffer, jpegBuffer] = await Promise.all([
        webpBlob.arrayBuffer(),
        jpegBlob.arrayBuffer()
    ]);

    return webpBuffer.byteLength <= jpegBuffer.byteLength
        ? { data: new Uint8Array(webpBuffer), format: 'webp' }
        : { data: new Uint8Array(jpegBuffer), format: 'jpeg' };
}