import JSZip from 'jszip';
import { calculateCropRect } from './emu';
import { createImageBitmap } from '../image-processing/bitmap';

interface CropInfo {
    slideNumber: number;
    relationshipId: string;
    cropRect: {
        l: number;
        t: number;
        r: number;
        b: number;
    };
}

/**
 * Extract crop information from slide XML
 * @param slideXml Slide XML content
 * @returns Array of crop information objects
 */
function extractCropInfo(slideXml: string): CropInfo[] {
    const cropInfos: CropInfo[] = [];
    const slideNumberMatch = slideXml.match(/slide(\d+)\.xml/);
    const slideNumber = slideNumberMatch ? parseInt(slideNumberMatch[1]) : 0;

    // Match blipFill elements with srcRect
    const blipFillRegex = /<p:blipFill[^>]*>(?:[^<]*|<(?!p:blipFill)[^>]*>)*<a:blip[^>]*r:embed="([^"]+)"[^>]*>(?:[^<]*|<(?!a:blip)[^>]*>)*<a:srcRect\s+([^>]+)>/g;
    let match;

    while ((match = blipFillRegex.exec(slideXml)) !== null) {
        const [, rId, srcRectAttrs] = match;
        
        // Extract l, t, r, b attributes
        const attrs = srcRectAttrs.match(/(?:l|t|r|b)="(\d+)"/g);
        if (!attrs) continue;

        const cropRect = {
            l: 0,
            t: 0,
            r: 0,
            b: 0
        };

        attrs.forEach(attr => {
            const [key, value] = attr.replace(/"/g, '').split('=');
            cropRect[key as keyof typeof cropRect] = parseInt(value);
        });

        cropInfos.push({
            slideNumber,
            relationshipId: rId,
            cropRect
        });
    }

    return cropInfos;
}

/**
 * Get image path from relationship file
 * @param relsXml Relationship XML content
 * @param relationshipId Target relationship ID
 * @returns Image path or null if not found
 */
function getImagePath(relsXml: string, relationshipId: string): string | null {
    const regex = new RegExp(`<Relationship[^>]+Id="${relationshipId}"[^>]+Target="([^"]+)"`, 'i');
    const match = relsXml.match(regex);
    if (!match) return null;

    const target = match[1];
    return target.startsWith('../') ? target.substring(3) : target;
}

/**
 * Process image cropping for a slide
 * @param pptx PowerPoint ZIP archive
 * @param slideFile Slide file path
 * @returns Promise resolving to true if any images were cropped
 */
export async function processImageCropping(pptx: JSZip, slideFile: string): Promise<boolean> {
    const slideContent = await pptx.file(slideFile)?.async('string');
    if (!slideContent) return false;

    const cropInfos = extractCropInfo(slideContent);
    if (cropInfos.length === 0) return false;

    // Get relationship file
    const relsFile = slideFile.replace('ppt/slides/', 'ppt/slides/_rels/') + '.rels';
    const relsContent = await pptx.file(relsFile)?.async('string');
    if (!relsContent) return false;

    let modified = false;

    for (const cropInfo of cropInfos) {
        const imagePath = getImagePath(relsContent, cropInfo.relationshipId);
        if (!imagePath) continue;

        const imageFile = pptx.file(`ppt/${imagePath}`);
        if (!imageFile) continue;

        // Process image cropping
        const imageData = await imageFile.async('arraybuffer');
        const imageBlob = new Blob([imageData]);
        const bitmap = await createImageBitmap(imageBlob);

        // Calculate crop rectangle
        const cropRect = calculateCropRect(
            cropInfo.cropRect.l,
            cropInfo.cropRect.t,
            cropInfo.cropRect.r,
            cropInfo.cropRect.b,
            bitmap.width,
            bitmap.height
        );

        // Create canvas and crop image
        const canvas = new OffscreenCanvas(cropRect.width, cropRect.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.drawImage(
            bitmap,
            cropRect.x,
            cropRect.y,
            cropRect.width,
            cropRect.height,
            0,
            0,
            cropRect.width,
            cropRect.height
        );

        // Convert to blob and update ZIP
        const croppedBlob = await canvas.convertToBlob();
        const croppedBuffer = await croppedBlob.arrayBuffer();
        pptx.file(`ppt/${imagePath}`, croppedBuffer);

        // Remove srcRect from slide XML
        const updatedSlideContent = slideContent.replace(
            /<a:srcRect[^>]+>/g,
            ''
        );
        pptx.file(slideFile, updatedSlideContent);

        modified = true;
        bitmap.close();
    }

    return modified;
}

/**
 * Process all slides in the PowerPoint file for image cropping
 * @param pptx PowerPoint ZIP archive
 * @returns Promise resolving to number of slides processed
 */
export async function processAllSlides(pptx: JSZip): Promise<number> {
    const slideFiles = Object.keys(pptx.files).filter(
        name => name.startsWith('ppt/slides/') && name.endsWith('.xml')
    );

    let processedCount = 0;
    for (const slideFile of slideFiles) {
        if (await processImageCropping(pptx, slideFile)) {
            processedCount++;
        }
    }

    return processedCount;
}
