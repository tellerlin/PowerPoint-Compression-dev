import type { JSZip } from 'jszip';  
import { logger } from '../debug-logger';  

interface CropInfo {  
  imageFile: string;  
  slideFile: string;  
  cropRect: {  
    left: number;  
    top: number;  
    right: number;  
    bottom: number;  
  };  
}  

export async function parseSlideImages(pptx: JSZip): Promise<CropInfo[]> {  
  const cropInfos: CropInfo[] = [];  
  const slideFiles = Object.keys(pptx.files).filter(name =>   
    name.startsWith('ppt/slides/') && name.endsWith('.xml')  
  );  

  logger.log('info', `Found ${slideFiles.length} slide files to process`);
  logger.log('debug', `Slide files:`, slideFiles);

  for (const slideFile of slideFiles) {  
    try {  
      const slideContent = await pptx.file(slideFile)?.async('string');  
      if (!slideContent) {  
        logger.log('warn', `Could not read slide file: ${slideFile}`);  
        continue;  
      }  
      logger.log('debug', `Processing slide content for ${slideFile}`, {
        contentPreview: slideContent.substring(0, 200)
      });

      const relsFile = slideFile.replace('.xml', '.xml.rels')  
        .replace('slides/', 'slides/_rels/');  
      logger.log('debug', `Looking for relationships file: ${relsFile}`);
      
      const relsContent = await pptx.file(relsFile)?.async('string');  
      if (!relsContent) {  
        logger.log('warn', `Could not read relationships file: ${relsFile}`);  
        continue;  
      }  
      logger.log('debug', `Found relationships file: ${relsFile}`);

      const images = parseImageCrops(slideContent, relsContent, slideFile);  
      images.forEach(image => {  
        cropInfos.push({ ...image, slideFile });  
      });  
    } catch (error) {  
      logger.log('error', `Error processing slide file: ${slideFile}`, error);  
    }  
  }  

  logger.log('info', `Found ${cropInfos.length} images with crop information`);  
  return cropInfos;  
}  

function parseImageCrops(slideContent: string, relsContent: string, slideFile: string): { imageFile: string; cropRect: { left: number; top: number; right: number; bottom: number } }[] {  
  const cropInfos: { imageFile: string; cropRect: { left: number; top: number; right: number; bottom: number } }[] = [];  

  // Log the full slide content for debugging  
  logger.log('debug', `Parsing slide content`, {  
      slideFile,  
      contentLength: slideContent.length,  
      hasBlipElements: slideContent.includes('<blip'),  
      hasSrcRect: slideContent.includes('<srcRect')  
  });  

  // Find all blip elements with their rIds  
  const blipRegex = /<(?:\w+:)?blip[^>]+r:embed="(rId\d+)[^>]*>(?:\s*<(?:\w+:)?srcRect\s+(?:l="(\\d+)"\s*)?(?:t="(\\d+)"\s*)?(?:r="(\\d+)"\s*)?(?:b="(\\d+)"\s*)?\/>)?/g;  
  let blipMatch;  

  while ((blipMatch = blipRegex.exec(slideContent)) !== null) {  
      const rId = blipMatch[1];  
      const blipFullMatch = blipMatch[0];  
      logger.log('debug', `Found blip element`, {  
          rId,  
          fullMatch: blipFullMatch,  
          index: blipMatch.index  
      });  

      // Get the context around the blip element  
      const contextStart = Math.max(0, blipMatch.index - 100);  
      const contextEnd = Math.min(slideContent.length, blipMatch.index + blipFullMatch.length + 100);  
      const context = slideContent.substring(contextStart, contextEnd);  

      // Find srcRect for this blip using a more precise regex  
      const srcRectRegex = new RegExp(  
          `<(?:\\w+:)?blip[^>]+r:embed="${rId}"[^>]*>\\s*<(?:\\w+:)?srcRect\\s+(?:l="(\\d+)"\\s*)?(?:t="(\\d+)"\\s*)?(?:r="(\\d+)"\\s*)?(?:b="(\\d+)"\\s*)?/>`,  
          'i'  
      );  
      const srcRectMatch = context.match(srcRectRegex);  

      if (srcRectMatch) {  
          logger.log('debug', `Found srcRect for rId: ${rId}`, {  
              raw: srcRectMatch[0],  
              left: srcRectMatch[1],  
              top: srcRectMatch[2],  
              right: srcRectMatch[3],  
              bottom: srcRectMatch[4]  
          });  

          // Parse crop values (convert from 100000ths to percentage)  
          const cropRect = {  
              left: parseInt(srcRectMatch[1] || '0') / 100000,  
              top: parseInt(srcRectMatch[2] || '0') / 100000,  
              right: parseInt(srcRectMatch[3] || '0') / 100000,  
              bottom: parseInt(srcRectMatch[4] || '0') / 100000  
          };  

          // Find image path from relationships  
          const relationshipRegex = new RegExp(  
              `<Relationship[^>]+Id="${rId}"[^>]+Target="([^"]+)"`,  
              'i'  
          );  
          const relationshipMatch = relsContent.match(relationshipRegex);  

          if (relationshipMatch) {  
              const target = relationshipMatch[1];  
              const imageFile = `ppt/${target.replace('../', '')}`;  
              logger.log('debug', `Resolved image file path for rId: ${rId}`, {  
                  target,  
                  imageFile,  
                  cropRect  
              });  
              cropInfos.push({ imageFile, cropRect });  
          } else {  
              logger.log('warn', `Could not find relationship for rId: ${rId} in ${slideFile}`);  
          }  
      } else {  
          logger.log('debug', `No srcRect found near blip element`, {  
              rId,  
              searchContext: context  
          });  
      }  
  }  

  return cropInfos;  
}  

export function removeSrcRect(slideContent: string, rId: string): string {  
  // First, find the blip element and its surrounding context  
  const blipIndex = slideContent.indexOf(`r:embed="${rId}"`);  
  if (blipIndex === -1) {  
      logger.log('warn', `Could not find blip element for rId: ${rId}`);  
      return slideContent;  
  }  

  // Get context around the blip element  
  const contextStart = Math.max(0, blipIndex - 100);  
  const contextEnd = Math.min(slideContent.length, blipIndex + 100);  
  const context = slideContent.substring(contextStart, contextEnd);  

  logger.log('debug', `Found blip context for removal`, {  
      rId,  
      context  
  });  

  // More precise regex to match and remove srcRect  
  const regex = new RegExp(  
      `<(?:\\w+:)?blip[^>]+r:embed="${rId}"[^>]*>\\s*<(?:\\w+:)?srcRect[^>]*/?>`,  
      'g'  
  );  

  const originalContent = slideContent;  
  const updatedContent = slideContent.replace(regex, `<blip r:embed="${rId}"/>`);  

  if (originalContent !== updatedContent) {  
      logger.log('debug', `Successfully removed srcRect tag`, {  
          rId,  
          originalLength: originalContent.length,  
          updatedLength: updatedContent.length,  
          diff: originalContent.length - updatedContent.length  
      });  
  } else {  
      logger.log('warn', `No srcRect tag found to remove for rId: ${rId}`);  
  }  

  return updatedContent;  
}