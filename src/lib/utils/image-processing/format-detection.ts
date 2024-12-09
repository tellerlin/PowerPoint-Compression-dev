export interface ImageAnalysis {
    hasAlpha: boolean;
    isAnimated: boolean;
}

export function analyzeImage(imageData: ImageData): ImageAnalysis {
    const hasAlpha = checkAlphaChannel(imageData);
    const isAnimated = false; // Future enhancement: detect animated images

    return { hasAlpha, isAnimated };
}

function checkAlphaChannel(imageData: ImageData): boolean {
    const data = imageData.data;
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 255) {
            return true;
        }
    }
    return false;
}