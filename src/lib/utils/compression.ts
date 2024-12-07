import JSZip from 'jszip';
import { browser } from '$app/environment';


async function compressPNGWithTransparency(data) {
    try {
        const img = new Image();
        img.src = URL.createObjectURL(new Blob([new Uint8Array(data)]));
        await new Promise(resolve => img.onload = resolve);


        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);


        const hasAlpha = ctx.getImageData(0, 0, img.width, img.height).data.some((v, i) => i % 4 === 3 && v < 255);


        if (hasAlpha) {
            const [newWidth, newHeight] = calculateScaledDimensions(img.width, img.height);
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);


            return new Promise((resolve, reject) => {
                canvas.toBlob(blob => {
                    blob?.arrayBuffer().then(buffer => resolve(new Uint8Array(buffer)))
                        .catch(reject);
                }, 'image/webp', 0.8);
            });
        }


        return await safeCompressImage(data, 'image.png');
    } catch (error) {
        console.warn('PNG compression failed', error);
        return data;
    }
}


function calculateScaledDimensions(width, height) {
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


export async function compressPPTX(file, onProgress) {
    if (!browser) throw new Error('PPTX compression is only supported in browser environment');
    if (!file.name.toLowerCase().endsWith('.pptx')) throw new Error('Only .pptx files are supported');


    const zip = new JSZip();
    const content = await file.arrayBuffer();
    const pptx = await zip.loadAsync(content);


    await cleanUnusedLayoutMedia(pptx);


    const images = Object.keys(pptx.files).filter(name => /\.(png|jpg|jpeg|gif)$/i.test(name));
    let processed = 0;


    for (const image of images) {
        try {
            const imgData = await pptx.file(image).async('arraybuffer');
            const processedImg = await (image.toLowerCase().endsWith('.png') 
                ? compressPNGWithTransparency(imgData) 
                : safeCompressImage(imgData, image));


            const bestImage = processedImg?.byteLength < imgData.byteLength ? processedImg : imgData;
            pptx.file(image, bestImage);


            onProgress(Math.round((++processed / images.length) * 100));
        } catch (error) {
            console.error(`Error processing ${image}:`, error);
        }
    }


    return await pptx.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
    });
}


async function safeCompressImage(data, imagePath) {
    if (!createImageBitmap || !document?.createElement) return data;


    try {
        const blob = new Blob([data]);
        const imageBitmap = await createImageBitmap(blob);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return data;


        const [newWidth, newHeight] = calculateScaledDimensions(imageBitmap.width, imageBitmap.height);
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);


        const [webpBlob, jpegBlob] = await Promise.all([
            blobFromCanvas(canvas, 'image/webp', 0.7),
            blobFromCanvas(canvas, 'image/jpeg', 0.7)
        ]);


        const [webpSize, jpegSize] = await Promise.all([
            webpBlob.arrayBuffer().then(b => b.byteLength),
            jpegBlob.arrayBuffer().then(b => b.byteLength)
        ]);


        const bestBlob = webpSize <= jpegSize ? webpBlob : jpegBlob;
        return new Uint8Array(await bestBlob.arrayBuffer());
    } catch (error) {
        console.warn('Image compression failed', error);
        return data;
    }
}


async function blobFromCanvas(canvas, type, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Blob creation failed')), type, quality);
    });
}


async function cleanUnusedLayoutMedia(pptx) {
    const usedMediaFiles = new Set();
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


    const mediaToClear = Object.keys(pptx.files)
        .filter(name => name.startsWith('ppt/media/') && /\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(name))
        .filter(mediaPath => !usedMediaFiles.has(mediaPath));


    mediaToClear.forEach(mediaPath => delete pptx.files[mediaPath]);
    console.log('Cleared media files:', mediaToClear);
}