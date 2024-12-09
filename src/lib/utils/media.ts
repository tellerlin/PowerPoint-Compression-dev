import type { JSZip } from 'jszip';

export async function removeUnusedMedia(pptx: JSZip): Promise<void> {
    const usedMediaFiles = await collectUsedMedia(pptx);
    const mediaToClear = findUnusedMedia(pptx, usedMediaFiles);
    
    mediaToClear.forEach(mediaPath => delete pptx.files[mediaPath]);
}

async function collectUsedMedia(pptx: JSZip): Promise<Set<string>> {
    const usedMediaFiles = new Set<string>();
    const mediaTraversalTasks = [
        { path: 'ppt/slides/_rels/', match: /\.rels$/ },
        { path: 'ppt/slideLayouts/_rels/', match: /\.rels$/ },
        { path: 'ppt/slideMasters/_rels/', match: /\.rels$/ }
    ];

    for (const task of mediaTraversalTasks) {
        const relsFiles = Object.keys(pptx.files)
            .filter(name => name.startsWith(task.path) && task.match.test(name));

        for (const relsFile of relsFiles) {
            const relsContent = await pptx.file(relsFile).async('string');
            const mediaMatches = relsContent.match(/Target="\.\.\/media\/([^"]+)"/g) || [];
            mediaMatches.forEach(match => {
                const mediaPath = match.match(/Target="\.\.\/media\/([^"]+)"/)[1];
                usedMediaFiles.add(`ppt/media/${mediaPath}`);
            });
        }
    }

    return usedMediaFiles;
}

function findUnusedMedia(pptx: JSZip, usedMediaFiles: Set<string>): string[] {
    return Object.keys(pptx.files)
        .filter(name => name.startsWith('ppt/media/') && /\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(name))
        .filter(mediaPath => !usedMediaFiles.has(mediaPath));
}