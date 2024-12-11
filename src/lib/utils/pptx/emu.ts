/**
 * Utility functions for handling EMU (English Metric Unit) conversions in PowerPoint
 */

export const EMU_PER_PIXEL = 9525;
export const EMU_PER_INCH = 914400;
export const EMU_PER_CM = 360000;

/**
 * Convert EMU value to pixels
 * @param emu EMU value to convert
 * @returns Number of pixels
 */
export function emuToPixels(emu: number): number {
    return Math.round(emu / EMU_PER_PIXEL);
}

/**
 * Convert pixels to EMU value
 * @param pixels Number of pixels to convert
 * @returns EMU value
 */
export function pixelsToEmu(pixels: number): number {
    return Math.round(pixels * EMU_PER_PIXEL);
}

/**
 * Calculate cropping rectangle from EMU values
 * @param l Left offset in EMU
 * @param t Top offset in EMU
 * @param r Right offset in EMU
 * @param b Bottom offset in EMU
 * @param imageWidth Original image width in pixels
 * @param imageHeight Original image height in pixels
 * @returns Cropping rectangle in pixels {x, y, width, height}
 */
export function calculateCropRect(
    l: number, 
    t: number, 
    r: number, 
    b: number,
    imageWidth: number,
    imageHeight: number
): { x: number; y: number; width: number; height: number } {
    // Convert EMU percentages to actual pixels
    const x = Math.round((l / 100000) * imageWidth);
    const y = Math.round((t / 100000) * imageHeight);
    const right = Math.round((r / 100000) * imageWidth);
    const bottom = Math.round((b / 100000) * imageHeight);

    return {
        x,
        y,
        width: imageWidth - (x + right),
        height: imageHeight - (y + bottom)
    };
}
