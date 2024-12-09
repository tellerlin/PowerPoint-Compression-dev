import JSZip from 'jszip';

async function compressPNGWithTransparency(data: ArrayBuffer) {
  try {
    // Create offscreen canvas in worker context
    const imageResponse = await fetch(URL.createObjectURL(new Blob([data])));
    const imageBlob = await imageResponse.blob();
    const bitmap = await createImageBitmap(imageBlob);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    const hasAlpha = imageData.data.some((v, i) => i % 4 === 3 && v < 255);

    if (hasAlpha) {
      const [newWidth, newHeight] = calculateScaledDimensions(bitmap.width, bitmap.height);
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);

      const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.8 });
      return new Uint8Array(await blob.arrayBuffer());
    }

    return await safeCompressImage(data, 'image.png');
  } catch (error) {
    console.warn('PNG compression failed', error);
    return new Uint8Array(data);
  }
}

function calculateScaledDimensions(width: number, height: number): [number, number] {
  let newWidth = width;
  let newHeight = height;

  if (newWidth > 1366) {
    newWidth = 1366;
    newHeight = Math.round((height * 1366) / width);
  }

  if (newHeight > 768) {
    newHeight = 768;
    newWidth = Math.round((width * 768) / height);
  }

  return [newWidth, newHeight];
}

async function safeCompressImage(data: ArrayBuffer, imagePath: string) {
  try {
    const imageResponse = await fetch(URL.createObjectURL(new Blob([data])));
    const imageBlob = await imageResponse.blob();
    const bitmap = await createImageBitmap(imageBlob);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return new Uint8Array(data);

    const [newWidth, newHeight] = calculateScaledDimensions(bitmap.width, bitmap.height);
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);

    const [webpBlob, jpegBlob] = await Promise.all([
      canvas.convertToBlob({ type: 'image/webp', quality: 0.7 }),
      canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 })
    ]);

    const [webpBuffer, jpegBuffer] = await Promise.all([
      webpBlob.arrayBuffer(),
      jpegBlob.arrayBuffer()
    ]);

    return new Uint8Array(webpBuffer.byteLength <= jpegBuffer.byteLength ? webpBuffer : jpegBuffer);
  } catch (error) {
    console.warn('Image compression failed', error);
    return new Uint8Array(data);
  }
}

async function cleanUnusedLayoutMedia(pptx: JSZip) {
  const usedMediaFiles = new Set<string>();
  const mediaTraversalTasks = [
    { path: 'ppt/slides/_rels/', match: /\.rels$/ },
    { path: 'ppt/slideLayouts/_rels/', match: /\.rels$/ },
    { path: 'ppt/slideMasters/_rels/', match: /\.rels$/ }
  ];

  for (const task of mediaTraversalTasks) {
    const relsFiles = Object.keys(pptx.files).filter(name => 
      name.startsWith(task.path) && task.match.test(name)
    );

    for (const relsFile of relsFiles) {
      const relsContent = await pptx.file(relsFile)?.async('string');
      if (!relsContent) continue;

      const mediaMatches = relsContent.match(/Target="\.\.\/media\/([^"]+)"/g) || [];
      mediaMatches.forEach(match => {
        const mediaPath = match.match(/Target="\.\.\/media\/([^"]+)"/)![1];
        usedMediaFiles.add(`ppt/media/${mediaPath}`);
      });
    }
  }

  const mediaToClear = Object.keys(pptx.files)
    .filter(name => name.startsWith('ppt/media/') && /\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(name))
    .filter(mediaPath => !usedMediaFiles.has(mediaPath));

  mediaToClear.forEach(mediaPath => delete pptx.files[mediaPath]);
  return mediaToClear;
}

self.onmessage = async (e: MessageEvent) => {
  try {
    const { file } = e.data;
    if (!file.name.toLowerCase().endsWith('.pptx')) {
      throw new Error('Only .pptx files are supported');
    }

    // Initial progress update
    self.postMessage({ 
      type: 'progress', 
      data: { progress: 0, status: 'Starting compression...' } 
    });

    const zip = new JSZip();
    const content = await file.arrayBuffer();
    const pptx = await zip.loadAsync(content);

    // Update progress after loading file
    self.postMessage({ 
      type: 'progress', 
      data: { progress: 10, status: 'Analyzing file structure...' } 
    });

    const clearedMedia = await cleanUnusedLayoutMedia(pptx);
    self.postMessage({ 
      type: 'progress', 
      data: { progress: 20, status: 'Cleaned unused media' } 
    });

    const images = Object.keys(pptx.files).filter(name => /\.(png|jpg|jpeg|gif)$/i.test(name));
    let processed = 0;
    const totalImages = images.length;

    for (const image of images) {
      try {
        const imgData = await pptx.file(image)?.async('arraybuffer');
        if (!imgData) continue;

        const processedImg = await (image.toLowerCase().endsWith('.png')
          ? compressPNGWithTransparency(imgData)
          : safeCompressImage(imgData, image));

        const bestImage = processedImg.byteLength < imgData.byteLength ? processedImg : new Uint8Array(imgData);
        pptx.file(image, bestImage);

        processed++;
        const currentProgress = Math.round((processed / totalImages) * 60) + 20; // Progress from 20% to 80%
        self.postMessage({
          type: 'progress',
          data: { 
            progress: currentProgress,
            status: `Processing image ${processed} of ${totalImages}`
          }
        });
      } catch (error) {
        console.error(`Error processing ${image}:`, error);
      }
    }

    // Update progress before final compression
    self.postMessage({ 
      type: 'progress', 
      data: { progress: 80, status: 'Finalizing compression...' } 
    });

    const compressedBlob = await pptx.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    }, (metadata) => {
      // Update progress during final compression
      const finalProgress = Math.round(metadata.percent * 0.2) + 80; // Progress from 80% to 100%
      self.postMessage({
        type: 'progress',
        data: { 
          progress: finalProgress,
          status: 'Generating compressed file...'
        }
      });
    });

    // Final progress update
    self.postMessage({ 
      type: 'progress', 
      data: { progress: 100, status: 'Compression complete!' } 
    });

    self.postMessage({ type: 'complete', data: compressedBlob });
  } catch (error) {
    self.postMessage({ 
      type: 'error', 
      data: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};