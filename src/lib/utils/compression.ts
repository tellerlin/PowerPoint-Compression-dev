import JSZip from 'jszip';  
import { browser } from '$app/environment';  

export async function compressPPTX(file, onProgress) {  
    if (!browser) {  
        throw new Error('PPTX compression is only supported in browser environment');  
    }  

    if (!file.name.toLowerCase().endsWith('.pptx')) {  
        throw new Error('Only .pptx files are supported');  
    }  

    const zip = new JSZip();  

    try {  
        const content = await file.arrayBuffer();  
        const pptx = await zip.loadAsync(content);  

        await cleanUnusedLayoutMedia(pptx);  

        const images = Object.keys(pptx.files).filter(name => /\.(png|jpg|jpeg|gif)$/i.test(name));  

        let processed = 0;  

        for (const image of images) {  
            try {  
                const imgData = await pptx.file(image).async('arraybuffer');  
                const compressedImg = await safeCompressImage(imgData, image);  

                // Choose the smallest image among original and compressed versions  
                const originalSize = imgData.byteLength;  
                let bestImage = imgData;  
                let bestSize = originalSize;  

                if (compressedImg && compressedImg.byteLength < bestSize) {  
                    bestImage = compressedImg;  
                    bestSize = compressedImg.byteLength;  
                }  

                // If compressed image is smaller, replace the original image  
                if (bestImage !== imgData) {  
                    pptx.file(image, bestImage);  
                }  

                processed++;  
                onProgress(Math.round((processed / images.length) * 100));  
            } catch (error) {  
                console.error(`Error processing ${image}:`, error);  
                // In case of error, keep the original image  
                pptx.file(image, imgData);  
            }  
        }  

        return await pptx.generateAsync({  
            type: 'blob',  
            compression: 'DEFLATE',  
            compressionOptions: { level: 9 }  
        });  
    } catch (error) {  
        console.error('PPTX compression error:', error);  
        throw error;  
    }  
}  

async function safeCompressImage(data, imagePath) {  
    if (  
        typeof createImageBitmap === 'undefined' ||  
        typeof document === 'undefined' ||  
        typeof document.createElement !== 'function'  
    ) {  
        return data;  
    }  

    try {  
        const blob = new Blob([data]);  
        const imageBitmap = await createImageBitmap(blob);  
        const canvas = document.createElement('canvas');  
        const ctx = canvas.getContext('2d');  

        if (!ctx) {  
            console.warn('Could not get canvas context');  
            return data;  
        }  

        const originalWidth = imageBitmap.width;  
        const originalHeight = imageBitmap.height;  

        // Determine the new dimensions while maintaining aspect ratio  
        let newWidth = originalWidth;  
        let newHeight = originalHeight;  

        if (originalWidth > 1920) {  
            newWidth = 1920;  
            newHeight = (originalHeight * newWidth) / originalWidth;  
        }  

        if (newHeight > 1200) {  
            newHeight = 1200;  
            newWidth = (originalWidth * newHeight) / originalHeight;  
        }  

        canvas.width = newWidth;  
        canvas.height = newHeight;  
        ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);  

        // Determine the format based on the original file extension  
        const extension = imagePath.substring(imagePath.lastIndexOf('.') + 1).toLowerCase();  
        const isPngWithTransparency = extension === 'png' && await hasTransparency(data);  

        // Compress to WebP and JPEG  
        const webpPromise = new Promise((resolve, reject) => {  
            canvas.toBlob((blob) => {  
                if (blob) resolve(blob);  
                else reject(new Error('WebP Blob creation failed'));  
            }, 'image/webp', 0.7);  
        });  

        const jpegPromise = new Promise((resolve, reject) => {  
            canvas.toBlob((blob) => {  
                if (blob) resolve(blob);  
                else reject(new Error('JPEG Blob creation failed'));  
            }, 'image/jpeg', 0.7);  
        });  

        // Wait for both promises  
        const [webpBlob, jpegBlob] = await Promise.all([webpPromise, jpegPromise]);  

        // Compare sizes and choose the smallest one  
        const webpSize = webpBlob ? webpBlob.arrayBuffer().then(buffer => buffer.byteLength) : Promise.resolve(Number.MAX_VALUE);  
        const jpegSize = jpegBlob ? jpegBlob.arrayBuffer().then(buffer => buffer.byteLength) : Promise.resolve(Number.MAX_VALUE);  

        const [webpByteLength, jpegByteLength] = await Promise.all([webpSize, jpegSize]);  

        let bestBlob;  
        if (webpByteLength <= jpegByteLength) {  
            bestBlob = webpBlob;  
        } else {  
            bestBlob = jpegBlob;  
        }  

        return new Uint8Array(await bestBlob.arrayBuffer());  
    } catch (error) {  
        console.warn('Image compression failed, returning original data', error);  
        return data;  
    }  
}  

async function hasTransparency(imageData) {  
    const img = new Image();  
    img.src = URL.createObjectURL(new Blob([new Uint8Array(imageData)]));  

    return new Promise((resolve) => {  
        img.onload = () => {  
            const canvas = document.createElement('canvas');  
            const ctx = canvas.getContext('2d');  
            canvas.width = img.width;  
            canvas.height = img.height;  
            ctx.drawImage(img, 0, 0);  

            const pixels = ctx.getImageData(0, 0, img.width, img.height).data;  
            for (let i = 3; i < pixels.length; i += 4) {  
                if (pixels[i] < 255) {  
                    resolve(true);  
                    return;  
                }  
            }  
            resolve(false);  
        };  
    });  
}  

async function cleanUnusedLayoutMedia(pptx) {  
    const usedLayouts = new Set();  
    const slideRelsFiles = Object.keys(pptx.files).filter(name => name.startsWith('ppt/slides/_rels/') && name.endsWith('.rels'));  

    for (const relsFile of slideRelsFiles) {  
        const relsContent = await pptx.file(relsFile).async('string');  
        const layoutMatch = relsContent.match(/Target="\.\.\/slideLayouts\/([^"]+)"/);  
        if (layoutMatch) {  
            usedLayouts.add(layoutMatch[1]);  
        }  
    }  

    const unusedLayoutRelsFiles = Object.keys(pptx.files).filter(  
        name => name.startsWith('ppt/slideLayouts/_rels/') && name.endsWith('.rels')  
    );  

    // Extract basename without .rels extension  
    const usedLayoutBasenames = Array.from(usedLayouts);  
    const unusedLayoutRelsFilesFiltered = unusedLayoutRelsFiles.filter(name => {  
        const fileName = name.substring(name.lastIndexOf('/') + 1);  
        const basename = fileName.replace('.rels', '');  
        return !usedLayoutBasenames.includes(basename);  
    });  

    const mediaToClear = [];  
    for (const relsFile of unusedLayoutRelsFilesFiltered) {  
        const relsContent = await pptx.file(relsFile).async('string');  
        const mediaMatches = relsContent.match(/Target="\.\.\/media\/([^"]+)"/g) || [];  

        for (const mediaMatch of mediaMatches) {  
            const mediaPath = mediaMatch.match(/Target="\.\.\/media\/([^"]+)"/)[1];  
            const fullMediaPath = `ppt/media/${mediaPath}`;  

            const mediaFile = pptx.files[fullMediaPath];  
            if (mediaFile) {  
                const mediaBuffer = await mediaFile.async('arraybuffer');  
                if (mediaBuffer.byteLength > 50 * 1024) {  
                    mediaToClear.push(fullMediaPath);  
                }  
            }  
        }  
    }  

    mediaToClear.forEach(mediaPath => {  
        delete pptx.files[mediaPath];  
    });  
}