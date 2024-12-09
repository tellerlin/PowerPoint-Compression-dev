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
      const { type, data } = e.data;

      switch (type) {
        case 'progress':
          onProgress(data);
          break;
        case 'complete':
          worker.terminate();
          resolve(data);
          break;
        case 'error':
          worker.terminate();
          reject(new Error(data));
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