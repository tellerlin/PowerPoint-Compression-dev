import type { JSZip } from 'jszip';

export async function cleanUnusedMedia(pptx: JSZip): Promise<string[]> {
    const usedMediaFiles = await collectUsedMedia(pptx);
    return removeUnusedFiles(pptx, usedMediaFiles);
}

async function collectUsedMedia(pptx: JSZip): Promise<Set<string>> {
    const usedMediaFiles = new Set<string>();
    const relationshipFiles = findRelationshipFiles(pptx);

    for (const relsFile of relationshipFiles) {
        const content = await pptx.file(relsFile)?.async('string');
        if (!content) continue;

        extractMediaReferences(content, usedMediaFiles);
    }

    return usedMediaFiles;
}

function findRelationshipFiles(pptx: JSZip): string[] {
    const relsPatterns = [
        'ppt/slides/_rels/',
        'ppt/slideLayouts/_rels/',
        'ppt/slideMasters/_rels/'
    ];

    return Object.keys(pptx.files).filter(name => 
        relsPatterns.some(pattern => name.startsWith(pattern) && name.endsWith('.rels'))
    );
}

function extractMediaReferences(content: string, usedMediaFiles: Set<string>): void {
    const mediaMatches = content.match(/Target="\.\.\/media\/([^"]+)"/g) || [];
    mediaMatches.forEach(match => {
        const mediaPath = match.match(/Target="\.\.\/media\/([^"]+)"/)![1];
        usedMediaFiles.add(`ppt/media/${mediaPath}`);
    });
}

function removeUnusedFiles(pptx: JSZip, usedMediaFiles: Set<string>): string[] {
    const mediaToClear = Object.keys(pptx.files)
        .filter(name => name.startsWith('ppt/media/') && /\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(name))
        .filter(mediaPath => !usedMediaFiles.has(mediaPath));

    mediaToClear.forEach(mediaPath => delete pptx.files[mediaPath]);
    return mediaToClear;
}