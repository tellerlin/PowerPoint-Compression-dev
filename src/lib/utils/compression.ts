import JSZip from 'jszip';  
import { browser } from '$app/environment';  


async function compressPNGWithTransparency(data) {
    try {
        // 使用 canvas 检查是否有透明通道
        const img = new Image();
        img.src = URL.createObjectURL(new Blob([new Uint8Array(data)]));


        await new Promise(resolve => {
            img.onload = resolve;
        });


        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);


        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const hasAlpha = imageData.data.some((value, index) => 
            index % 4 === 3 && value < 255
        );


        // 如果有透明通道，使用特殊压缩方法
        if (hasAlpha) {
            // 限制最大尺寸
            let newWidth = img.width;
            let newHeight = img.height;


            if (newWidth > 1920) {
                newWidth = 1920;
                newHeight = Math.round((img.height * 1920) / img.width);
            }


            if (newHeight > 1200) {
                newHeight = 1200;
                newWidth = Math.round((img.width * 1200) / img.height);
            }


            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);


            // 使用 canvas 导出带透明度的 WebP
            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        blob.arrayBuffer().then(buffer => {
                            resolve(new Uint8Array(buffer));
                        });
                    } else {
                        reject(new Error('PNG compression failed'));
                    }
                }, 'image/webp', 0.8);
            });
        }


        // 如果没有透明通道，使用普通压缩
        return await safeCompressImage(data, 'image.png');
    } catch (error) {
        console.warn('PNG compression failed, returning original data', error);
        return data;
    }
}


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
                
                // 针对 PNG 文件使用特殊压缩方法
                let processedImg = imgData;
                if (image.toLowerCase().endsWith('.png')) {
                    processedImg = await compressPNGWithTransparency(imgData);
                } else {
                    processedImg = await safeCompressImage(imgData, image);
                }


                // Choose the smallest image among original and compressed versions  
                const originalSize = imgData.byteLength;  
                let bestImage = imgData;  
                let bestSize = originalSize;  


                if (processedImg && processedImg.byteLength < bestSize) {  
                    bestImage = processedImg;  
                    bestSize = processedImg.byteLength;  
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
    // 收集所有已使用的媒体文件路径
    const usedMediaFiles = new Set();


    // 第一步：遍历所有幻灯片的关系文件，找出使用的 layout 和相关媒体
    const slideRelsFiles = Object.keys(pptx.files).filter(
        name => name.startsWith('ppt/slides/_rels/') && name.endsWith('.rels')
    );


    for (const relsFile of slideRelsFiles) {
        const relsContent = await pptx.file(relsFile).async('string');
        
        // 直接收集 slide 关联的媒体文件
        const slideMediaMatches = relsContent.match(/Target="\.\.\/media\/([^"]+)"/g) || [];
        slideMediaMatches.forEach(match => {
            const mediaPath = match.match(/Target="\.\.\/media\/([^"]+)"/)[1];
            usedMediaFiles.add(`ppt/media/${mediaPath}`);
        });
        
        // 找出使用的 layout
        const layoutMatch = relsContent.match(/Target="\.\.\/slideLayouts\/([^"]+)"/);
        if (layoutMatch) {
            const layoutName = layoutMatch[1];
            const layoutRelsPath = `ppt/slideLayouts/_rels/${layoutName}.rels`;


            // 如果布局关系文件存在
            if (pptx.files[layoutRelsPath]) {
                const layoutRelsContent = await pptx.file(layoutRelsPath).async('string');
                
                // 找出布局关系文件中的媒体文件
                const layoutMediaMatches = layoutRelsContent.match(/Target="\.\.\/media\/([^"]+)"/g) || [];
                layoutMediaMatches.forEach(match => {
                    const mediaPath = match.match(/Target="\.\.\/media\/([^"]+)"/)[1];
                    usedMediaFiles.add(`ppt/media/${mediaPath}`);
                });


                // 找出关联的 slideMaster
                const masterMatch = layoutRelsContent.match(/Target="\.\.\/slideMasters\/([^"]+)"/);
                if (masterMatch) {
                    const masterRelsPath = `ppt/slideMasters/_rels/${masterMatch[1]}.rels`;
                    
                    if (pptx.files[masterRelsPath]) {
                        const masterRelsContent = await pptx.file(masterRelsPath).async('string');
                        
                        // 找出 slideMaster 中的媒体文件
                        const masterMediaMatches = masterRelsContent.match(/Target="\.\.\/media\/([^"]+)"/g) || [];
                        masterMediaMatches.forEach(match => {
                            const mediaPath = match.match(/Target="\.\.\/media\/([^"]+)"/)[1];
                            usedMediaFiles.add(`ppt/media/${mediaPath}`);
                        });
                    }
                }
            }
        }
    }


    // 第二步：删除未使用且大于50KB的媒体文件
    const mediaToClear = [];
    const mediaFiles = Object.keys(pptx.files).filter(
        name => name.startsWith('ppt/media/') && /\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(name)
    );


    for (const mediaPath of mediaFiles) {
        if (!usedMediaFiles.has(mediaPath)) {
            const mediaFile = pptx.files[mediaPath];
            const mediaBuffer = await mediaFile.async('arraybuffer');
            
            if (mediaBuffer.byteLength > 50 * 1024) {
                mediaToClear.push(mediaPath);
            }
        }
    }


    // 删除找到的媒体文件
    mediaToClear.forEach(mediaPath => {
        delete pptx.files[mediaPath];
    });


    console.log('Cleared media files:', mediaToClear);
}