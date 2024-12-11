import { browser } from '$app/environment';
import type { CompressionProgress } from '$lib/types';


export async function compressPPTX(
  file: File, 
  onProgress: (progress: CompressionProgress) => void
): Promise<Blob> {
  if (!browser) {
    throw new Error('PPTX compression is only supported in browser environment');
  }


  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('../workers/compression.worker.ts', import.meta.url),
      { type: 'module' }
    );


    worker.onmessage = (e) => {
      const { status, blob, data, message, details } = e.data;


      switch (status) {
        case 'progress':
          onProgress(data);
          break;
        case 'done':
          try {
            // 将 ArrayBuffer 转换为 Blob
            const compressedBlob = new Blob([blob], { 
              type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
            });
            
            worker.terminate();
            resolve(compressedBlob);
          } catch (error) {
            worker.terminate();
            reject(new Error(`Failed to convert compressed file: ${error instanceof Error ? error.message : 'Unknown error'}`));
          }
          break;
        case 'error':
          worker.terminate();
          reject(new Error(message || 'Unknown compression error'));
          break;
      }
    };


    worker.onerror = (error) => {
      worker.terminate();
      reject(new Error(`Worker error: ${error.message}`));
    };


    worker.postMessage({ file });
  });
}