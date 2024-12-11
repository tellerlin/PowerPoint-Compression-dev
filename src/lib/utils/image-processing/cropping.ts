export async function cropImage(
  imageData: ArrayBuffer,
  cropRect: { left: number; top: number; right: number; bottom: number }
): Promise<ArrayBuffer> {
  const blob = new Blob([imageData]);
  const bitmap = await createImageBitmap(blob);

  // Calculate actual pixel dimensions from percentages
  const cropX = Math.round(bitmap.width * (cropRect.left / 100));
  const cropY = Math.round(bitmap.height * (cropRect.top / 100));
  const cropWidth = Math.round(bitmap.width * (1 - (cropRect.left + cropRect.right) / 100));
  const cropHeight = Math.round(bitmap.height * (1 - (cropRect.top + cropRect.bottom) / 100));

  // Create canvas for cropping
  const canvas = new OffscreenCanvas(cropWidth, cropHeight);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Draw cropped portion
  ctx.drawImage(
    bitmap,
    cropX, cropY, cropWidth, cropHeight,
    0, 0, cropWidth, cropHeight
  );

  // Convert back to ArrayBuffer
  const croppedBlob = await canvas.convertToBlob();
  return await croppedBlob.arrayBuffer();
}