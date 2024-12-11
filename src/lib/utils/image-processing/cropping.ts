import { logger } from '../debug-logger';  

export async function cropImage(  
  imageData: ArrayBuffer,  
  cropRect: { left: number; top: number; right: number; bottom: number }  
): Promise<ArrayBuffer> {  
  try {  
    logger.log('debug', 'Starting image cropping', { 
      cropRect,
      imageDataSize: imageData.byteLength
    });  

    const blob = new Blob([imageData]);  
    const bitmap = await createImageBitmap(blob);  
    logger.log('debug', 'Created source bitmap', { 
      width: bitmap.width, 
      height: bitmap.height 
    });  

    // Calculate actual pixel dimensions from percentages  
    // Note: PowerPoint stores crop values as percentages of the original image size
    const cropX = Math.round(bitmap.width * (cropRect.left / 100));  
    const cropY = Math.round(bitmap.height * (cropRect.top / 100));  
    const cropWidth = Math.round(bitmap.width * (1 - (cropRect.left + cropRect.right) / 100));  
    const cropHeight = Math.round(bitmap.height * (1 - (cropRect.top + cropRect.bottom) / 100));  

    logger.log('debug', 'Calculated crop dimensions', {  
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      originalWidth: bitmap.width,
      originalHeight: bitmap.height,
      percentages: {
        left: cropRect.left,
        top: cropRect.top,
        right: cropRect.right,
        bottom: cropRect.bottom
      }
    });  

    // Validate crop dimensions
    if (cropWidth <= 0 || cropHeight <= 0) {
      throw new Error(`Invalid crop dimensions: width=${cropWidth}, height=${cropHeight}`);
    }
    if (cropX < 0 || cropY < 0 || cropX + cropWidth > bitmap.width || cropY + cropHeight > bitmap.height) {
      throw new Error(`Crop rectangle out of bounds: x=${cropX}, y=${cropY}, width=${cropWidth}, height=${cropHeight}`);
    }

    const canvas = new OffscreenCanvas(cropWidth, cropHeight);  
    const ctx = canvas.getContext('2d');  
    if (!ctx) {  
      throw new Error('Failed to get canvas context');  
    }  

    // Clear the canvas first
    ctx.clearRect(0, 0, cropWidth, cropHeight);

    // Draw the cropped portion
    ctx.drawImage(  
      bitmap,  
      cropX, cropY, cropWidth, cropHeight,  // Source rectangle
      0, 0, cropWidth, cropHeight          // Destination rectangle
    );  

    logger.log('debug', 'Image drawn to canvas');

    // Convert to blob with high quality
    const croppedBlob = await canvas.convertToBlob({
      type: 'image/png',
      quality: 1.0
    });
    const croppedBuffer = await croppedBlob.arrayBuffer();  

    logger.log('debug', 'Size comparison', {  
      originalSize: imageData.byteLength,  
      croppedSize: croppedBuffer.byteLength,
      compressionRatio: ((1 - croppedBuffer.byteLength / imageData.byteLength) * 100).toFixed(2) + '%',
      finalDimensions: {
        width: cropWidth,
        height: cropHeight
      }
    });  

    // Cleanup
    bitmap.close();

    return croppedBuffer;  
  } catch (error) {  
    logger.log('error', 'Error during image cropping', {
      error: error instanceof Error ? error.message : 'Unknown error',
      cropRect,
      imageDataSize: imageData.byteLength
    });  
    throw error;  
  }  
}