import JSZip from 'jszip';
import { compressImage } from './image-compression';
import { createWorker, terminateWorker } from './worker';
import { removeUnusedMedia } from './media';
import type { CompressionProgress } from '$lib/types/compression';

const BATCH_SIZE = 3;

export async function processPPTX(
    file: File, 
    onProgress: (progress: CompressionProgress) => void
): Promise<Blob> {
    const zip = new JSZip();
    const content = await file.arrayBuffer();
    const pptx = await zip.loadAsync(content);
    
    try {
        await removeUnusedMedia(pptx);
        await processImagesInBatches(pptx, onProgress);
        
        return await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 }
        });
    } catch (error) {
        throw new Error(`Failed to process PPTX: ${error.message}`);
    }
}

async function processImagesInBatches(
    pptx: JSZip, 
    onProgress: (progress: CompressionProgress) => void
): Promise<void> {
    const images = Object.keys(pptx.files).filter(name => /\.(png|jpg|jpeg|gif)$/i.test(name));
    const totalImages = images.length;
    let processedCount = 0;

    for (let i = 0; i < images.length; i += BATCH_SIZE) {
        const batch = images.slice(i, i + BATCH_SIZE);
        const workers = batch.map(image => {
            const worker = createWorker(async (imgData: ArrayBuffer) => {
                const result = await compressImage(imgData, { quality: 0.7 });
                return { image, result };
            });
            return worker;
        });

        const tasks = batch.map(async (image, index) => {
            const imgData = await pptx.file(image).async('arraybuffer');
            return new Promise((resolve, reject) => {
                workers[index].onmessage = (e) => {
                    const { image, result } = e.data;
                    if (result.byteLength < imgData.byteLength) {
                        pptx.file(image, result);
                    }
                    processedCount++;
                    onProgress({
                        progress: Math.round((processedCount / totalImages) * 100),
                        status: `Processing image ${processedCount} of ${totalImages}`
                    });
                    resolve(null);
                };
                workers[index].onerror = reject;
                workers[index].postMessage(imgData);
            });
        });

        try {
            await Promise.all(tasks);
        } finally {
            workers.forEach(terminateWorker);
        }
    }
}