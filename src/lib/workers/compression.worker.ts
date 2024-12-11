import JSZip from 'jszip';  
import { analyzeImage } from '../utils/image-processing/format-detection';  
import { optimizeImage } from '../utils/image-processing/optimization';  
import { cleanUnusedMedia } from '../utils/pptx/media-cleanup';  
import { createImageProcessingQueue } from '../utils/image-processing/queue';  
import { COMPRESSION_SETTINGS } from '../utils/image-processing/constants';  
import { checkMemoryUsage, cleanupImageResources } from '../utils/image-processing/memory-management';  
import { handleImageError, isProcessableImage } from '../utils/image-processing/error-handling';  
import { parseSlideImages, removeSrcRect } from '../utils/pptx/xml-parser';  
import { cropImage } from '../utils/image-processing/cropping';  
import { logger } from '../utils/debug-logger';  

const {  
    BATCH_SIZE,  
    MAX_CONCURRENT_OPERATIONS,  
    MEMORY_THRESHOLD  
} = COMPRESSION_SETTINGS;  

self.onmessage = async (e: MessageEvent) => {  
    try {  
        const { file } = e.data;  
        if (!file.name.toLowerCase().endsWith('.pptx')) {  
            throw new Error('Only .pptx files are supported');  
        }  

        logger.log('info', 'Starting PPTX processing', { fileName: file.name, fileSize: file.size, lastModified: new Date(file.lastModified).toISOString() });  

        const queue = createImageProcessingQueue(MAX_CONCURRENT_OPERATIONS);  
        updateProgress(0, 'Starting compression...');  

        const zip = new JSZip();  
        const content = await file.arrayBuffer();  
        const pptx = await zip.loadAsync(content);  
        logger.log('debug', 'PPTX file loaded', { totalFiles: Object.keys(pptx.files).length, totalSize: content.byteLength });  

        updateProgress(10, 'Analyzing file structure...');  
        await cleanUnusedMedia(pptx);  

        // Parse slide images and get crop information  
        updateProgress(20, 'Processing image crops...');  
        const cropInfos = await parseSlideImages(pptx);  

        logger.log('info', `Processing ${cropInfos.length} images with crop information`);  
        for (const cropInfo of cropInfos) {  
            const imgFile = pptx.file(cropInfo.imageFile);  
            if (!imgFile) {  
                logger.log('warn', `Image file not found: ${cropInfo.imageFile}`);  
                continue;  
            }  

            try {  
                logger.log('debug', `Processing image: ${cropInfo.imageFile}`, { slideFile: cropInfo.slideFile, cropRect: cropInfo.cropRect });  
                const imgData = await imgFile.async('arraybuffer');  
                const croppedData = await cropImage(imgData, cropInfo.cropRect);  
                pptx.file(cropInfo.imageFile, croppedData);  

                const slideFile = cropInfo.slideFile;  
                const slideContent = await pptx.file(slideFile)?.async('string');  
                if (slideContent) {  
                    const rId = cropInfo.imageFile.match(/image(\d+)/)?.[1];  
                    if (rId) {  
                        const updatedContent = removeSrcRect(slideContent, `rId${rId}`);  
                        pptx.file(slideFile, updatedContent);  
                        logger.log('debug', `Updated slide XML: ${slideFile}`);  
                    }  
                }  
            } catch (error) {  
                logger.log('error', `Error processing image: ${cropInfo.imageFile}`, error);  
            }  
        }  

        // Then process all images for compression  
        updateProgress(40, 'Compressing images...');  
        const images = Object.keys(pptx.files).filter(isProcessableImage);  
        let processed = 0;  
        const totalImages = images.length;  

        logger.log('info', `Starting compression for ${totalImages} images`);  

        for (let i = 0; i < images.length; i += BATCH_SIZE) {  
            await checkMemoryUsage(MEMORY_THRESHOLD);  

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

                        const optimized = await optimizeImage(imgData, analysis);  
                        if (optimized.data.byteLength < imgData.byteLength) {  
                            pptx.file(image, optimized.data);  
                            logger.log('debug', `Compressed image: ${image}`, { originalSize: imgData.byteLength, compressedSize: optimized.data.byteLength, compressionRatio: ((1 - optimized.data.byteLength / imgData.byteLength) * 100).toFixed(2) + '%' });  
                        } else {  
                            logger.log('debug', `Image not compressed: ${image}`, { originalSize: imgData.byteLength, compressedSize: optimized.data.byteLength });  
                        }  
                        processed++;  
                        updateProgress(40 + Math.min(50 * processed / totalImages, 50), 'Compressing images...');  
                    });  
                } catch (error) {  
                    logger.log('error', `Error optimizing image: ${image}`, error);  
                }  
            }));  

            updateProgress(40 + 50 * (i + batch.length) / totalImages, 'Compressing images - Batch complete');  
        }  

        // Wait for all queue tasks to complete  
        await queue.flush();  

        updateProgress(90, 'Finalizing PPTX file...');  

        const blob = await pptx.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 9 } });  
        if (!blob || blob.size === 0) {  
            throw new Error('Generated blob is invalid or empty');  
        }  

        self.postMessage({ status: 'done', blob }, [blob]);  
    } catch (error) {  
        logger.log('error', 'Compression failed', error);  
        self.postMessage({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' });  
    }  
};  

function updateProgress(progress: number, status: string): void {  
    self.postMessage({ type: 'progress', data: { progress, status } });  
}