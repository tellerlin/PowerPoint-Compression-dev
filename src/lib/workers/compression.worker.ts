import JSZip from 'jszip';
import { analyzeImage } from '../utils/image-processing/format-detection';
import { compressImage } from '../utils/image-processing/compression';
import { cleanUnusedMedia } from '../utils/pptx/media-cleanup';
import { createImageProcessingQueue } from '../utils/image-processing/queue';

// Add memory management
const BATCH_SIZE = 3;
const MAX_CONCURRENT_OPERATIONS = 2;
const MEMORY_THRESHOLD = 0.8; // 80% memory usage threshold

self.onmessage = async (e: MessageEvent) => {
    try {
        const { file } = e.data;
        if (!file.name.toLowerCase().endsWith('.pptx')) {
            throw new Error('Only .pptx files are supported');
        }

        const queue = createImageProcessingQueue(MAX_CONCURRENT_OPERATIONS);
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

        for (let i = 0; i < images.length; i += BATCH_SIZE) {
            // Check memory usage
            if (self.performance && self.performance.memory) {
                const memoryUsage = self.performance.memory.usedJSHeapSize / self.performance.memory.jsHeapSizeLimit;
                if (memoryUsage > MEMORY_THRESHOLD) {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Memory cool-down
                }
            }

            const batch = images.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map(async (image) => {
                try {
                    await queue.add(async () => {
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

                        // Cleanup
                        bitmap.close();
                        canvas.width = 0;
                        canvas.height = 0;
                    });

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