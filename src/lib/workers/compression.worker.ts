import JSZip from 'jszip';
import { analyzeImage } from '../utils/image-processing/format-detection';
import { compressImage } from '../utils/image-processing/compression';
import { cleanUnusedMedia } from '../utils/pptx/media-cleanup';

self.onmessage = async (e: MessageEvent) => {
    try {
        const { file } = e.data;
        if (!file.name.toLowerCase().endsWith('.pptx')) {
            throw new Error('Only .pptx files are supported');
        }

        updateProgress(0, 'Starting compression...');

        const zip = new JSZip();
        const content = await file.arrayBuffer();
        const pptx = await zip.loadAsync(content);

        updateProgress(10, 'Analyzing file structure...');
        await cleanUnusedMedia(pptx);
        updateProgress(20, 'Cleaned unused media');

        const images = Object.keys(pptx.files)
            .filter(name => /\.(png|jpg|jpeg|gif)$/i.test(name));
        
        let processed = 0;
        const totalImages = images.length;
        const batchSize = 3;

        for (let i = 0; i < images.length; i += batchSize) {
            const batch = images.slice(i, i + batchSize);
            await Promise.all(batch.map(async (image) => {
                try {
                    const imgData = await pptx.file(image)?.async('arraybuffer');
                    if (!imgData) return;

                    const imageBlob = new Blob([imgData]);
                    const bitmap = await createImageBitmap(imageBlob);
                    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    ctx.drawImage(bitmap, 0, 0);
                    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
                    const analysis = analyzeImage(imageData);
                    
                    const compressedResult = await compressImage(imgData, analysis);
                    if (compressedResult.data.byteLength < imgData.byteLength) {
                        pptx.file(image, compressedResult.data);
                    }

                    processed++;
                    const currentProgress = Math.round((processed / totalImages) * 60) + 20;
                    updateProgress(
                        currentProgress,
                        `Processing image ${processed} of ${totalImages}`
                    );
                } catch (error) {
                    console.error(`Error processing ${image}:`, error);
                }
            }));
        }

        updateProgress(80, 'Finalizing compression...');

        const compressedBlob = await pptx.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 }
        }, (metadata) => {
            const finalProgress = Math.round(metadata.percent * 0.2) + 80;
            updateProgress(finalProgress, 'Generating compressed file...');
        });

        updateProgress(100, 'Compression complete!');
        self.postMessage({ type: 'complete', data: compressedBlob });
    } catch (error) {
        self.postMessage({ 
            type: 'error', 
            data: error instanceof Error ? error.message : 'Unknown error occurred' 
        });
    }
};

function updateProgress(progress: number, status: string): void {
    self.postMessage({ 
        type: 'progress', 
        data: { progress, status } 
    });
}