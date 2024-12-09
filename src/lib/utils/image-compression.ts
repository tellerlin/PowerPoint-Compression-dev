import type { ImageCompressionOptions } from '$lib/types/compression';

export async function compressImage(data: ArrayBuffer, options: ImageCompressionOptions): Promise<Uint8Array> {
    try {
        const img = await createImageFromBuffer(data);
        const canvas = createCanvas(img);
        const ctx = canvas.getContext('2d');
        if (!ctx) return new Uint8Array(data);

        const hasAlpha = checkAlphaChannel(ctx, img);
        if (hasAlpha) {
            return await compressWithAlpha(canvas, img, options);
        }
        
        return await compressWithoutAlpha(canvas, img, options);
    } catch (error) {
        return new Uint8Array(data);
    }
}

async function createImageFromBuffer(data: ArrayBuffer): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = URL.createObjectURL(new Blob([new Uint8Array(data)]));
    await new Promise(resolve => img.onload = resolve);
    return img;
}

function createCanvas(img: HTMLImageElement): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const [width, height] = calculateDimensions(img.width, img.height);
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function calculateDimensions(width: number, height: number): [number, number] {
    const maxWidth = 1366;
    const maxHeight = 768;
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    
    return ratio < 1 
        ? [Math.round(width * ratio), Math.round(height * ratio)]
        : [width, height];
}

function checkAlphaChannel(ctx: CanvasRenderingContext2D, img: HTMLImageElement): boolean {
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height)
        .data.some((v, i) => i % 4 === 3 && v < 255);
}

async function compressWithAlpha(
    canvas: HTMLCanvasElement, 
    img: HTMLImageElement, 
    options: ImageCompressionOptions
): Promise<Uint8Array> {
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob(blob => resolve(blob!), 'image/webp', options.quality)
    );
    
    return new Uint8Array(await blob.arrayBuffer());
}

async function compressWithoutAlpha(
    canvas: HTMLCanvasElement, 
    img: HTMLImageElement, 
    options: ImageCompressionOptions
): Promise<Uint8Array> {
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const [webpBlob, jpegBlob] = await Promise.all([
        new Promise<Blob>(resolve => canvas.toBlob(blob => resolve(blob!), 'image/webp', options.quality)),
        new Promise<Blob>(resolve => canvas.toBlob(blob => resolve(blob!), 'image/jpeg', options.quality))
    ]);
    
    const [webpSize, jpegSize] = await Promise.all([
        webpBlob.arrayBuffer(),
        jpegBlob.arrayBuffer()
    ]);
    
    return new Uint8Array(webpSize.byteLength <= jpegSize.byteLength ? webpSize : jpegSize);
}