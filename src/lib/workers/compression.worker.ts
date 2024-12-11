import JSZip from 'jszip';
import { analyzeImage } from '../utils/image-processing/format-detection';
import { optimizeImage } from '../utils/image-processing/optimization';
import { cleanUnusedMedia } from '../utils/pptx/media-cleanup';
import { createImageProcessingQueue } from '../utils/image-processing/queue';
import { COMPRESSION_SETTINGS } from '../utils/image-processing/constants';
import { checkMemoryUsage, cleanupImageResources } from '../utils/image-processing/memory-management';
import { handleImageError, isProcessableImage } from '../utils/image-processing/error-handling';
import { processAllSlides } from '../utils/pptx/image-cropping';
import { logger } from '../../lib/utils/debug-logger';


const {
    BATCH_SIZE,
    MAX_CONCURRENT_OPERATIONS,
    MEMORY_THRESHOLD,
    COOLDOWN_TIME
} = COMPRESSION_SETTINGS;

self.onmessage = async (e: MessageEvent) => {
  try {
      logger.log('info', 'Worker started', { eventData: e.data });


      const { file } = e.data;
      
      // 文件验证保持不变
      if (!file) {
          throw new Error('No file provided');
      }
      
      if (!file.name) {
          throw new Error('File name is missing');
      }
      
      if (!file.name.toLowerCase().endsWith('.pptx')) {
          throw new Error(`Unsupported file type: ${file.name}`);
      }


      const fileSize = file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown';
      logger.log('info', 'File details', { 
          fileName: file.name, 
          fileSize: fileSize 
      });


      // 创建队列
      const queue = createImageProcessingQueue(MAX_CONCURRENT_OPERATIONS);
      updateProgress(0, 'Starting compression...');


      const zip = new JSZip();
      const content = await file.arrayBuffer();
      const pptx = await zip.loadAsync(content);


      updateProgress(10, 'Analyzing file structure...');
      await cleanUnusedMedia(pptx);
      updateProgress(15, 'Cleaned unused media');


      updateProgress(20, 'Processing image cropping...');
      const processedSlides = await processAllSlides(pptx);
      updateProgress(30, `Processed image cropping in ${processedSlides} slides`);


      const images = Object.keys(pptx.files).filter(isProcessableImage);
      let processed = 0;
      const totalImages = images.length;


      logger.log('info', `Starting compression for ${totalImages} images`);


      // 创建任务数组
      const compressionTasks = images.map(image => async () => {
          try {
              await checkMemoryUsage(MEMORY_THRESHOLD);


              const imgData = await pptx.file(image)?.async('arraybuffer');
              if (!imgData) {
                  logger.log('warn', `Image data not found: ${image}`);
                  return;
              }


              const imageBlob = new Blob([imgData]);
              const bitmap = await createImageBitmap(imageBlob);
              const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                  logger.log('warn', `Cannot create 2D context for image: ${image}`);
                  return;
              }


              ctx.drawImage(bitmap, 0, 0);
              const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
              const analysis = analyzeImage(imageData);


              const optimized = await optimizeImage(imgData, analysis);
              if (optimized.data.byteLength < imgData.byteLength) {
                  pptx.file(image, optimized.data);
                  logger.log('debug', `Compressed image: ${image}`, { 
                      originalSize: imgData.byteLength, 
                      compressedSize: optimized.data.byteLength, 
                      compressionRatio: ((1 - optimized.data.byteLength / imgData.byteLength) * 100).toFixed(2) + '%' 
                  });
              } else {
                  logger.log('debug', `Image not compressed: ${image}`, { 
                      originalSize: imgData.byteLength, 
                      compressedSize: optimized.data.byteLength 
                  });
              }


              processed++;
              updateProgress(30 + Math.min(50 * processed / totalImages, 50), 'Compressing images...');
          } catch (innerError) {
              logger.log('error', `Critical error in image processing for ${image}`, {
                  message: innerError instanceof Error ? innerError.message : 'Unknown error',
                  stack: innerError instanceof Error ? innerError.stack : 'No stack trace'
              });
              throw innerError; // 确保错误能被捕获
          }
      });


      // 使用队列处理所有图像压缩任务
      await Promise.all(compressionTasks.map(task => queue.add(task)));


      updateProgress(90, 'Finalizing PPTX file...');


      const blob = await pptx.generateAsync({ 
        type: 'arraybuffer', // 使用 arraybuffer 代替 blob
        compression: 'DEFLATE', 
        compressionOptions: { level: 9 } 
    });


    if (!blob || blob.byteLength === 0) {
        throw new Error('Generated buffer is invalid or empty');
    }


    logger.log('info', 'Compression completed successfully', {
        originalFileSize: file.size,
        compressedFileSize: blob.byteLength,
        compressionRatio: ((1 - blob.byteLength / file.size) * 100).toFixed(2) + '%'
    });


    // 使用 transferable ArrayBuffer
    self.postMessage({ 
        status: 'done', 
        blob: blob 
    }, [blob]);


} catch (error) {
    logger.log('error', 'Compression failed', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'Unknown error type'
    });


    self.postMessage({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? {
            name: error.name,
            stack: error.stack
        } : {}
    });
} finally {
    try {
        cleanupImageResources();
    } catch (cleanupError) {
        logger.log('error', 'Resource cleanup failed', {
            message: cleanupError instanceof Error ? cleanupError.message : 'Unknown cleanup error'
        });
    }
}
};

function updateProgress(progress: number, status: string): void {
  try {
      // 确保进度在 0-100 之间
      const safeProgress = Math.max(0, Math.min(100, progress));
      
      // 记录进度日志（可选）
      logger.log('debug', 'Progress update', { 
          progress: safeProgress, 
          status 
      });


      // 发送进度消息，确保使用 'progress' 类型
      self.postMessage({ 
          type: 'progress', 
          data: { 
              progress: safeProgress, 
              status 
          } 
      });
  } catch (error) {
      // 捕获并记录任何进度更新错误
      logger.log('error', 'Error in progress update', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace'
      });
  }
}

// 导出空对象确保这是一个模块
export {};