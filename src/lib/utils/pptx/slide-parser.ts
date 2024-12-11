interface CropInfo {
  imageFile: string;
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

  for (const slideFile of slideFiles) {
    const slideContent = await pptx.file(slideFile)?.async('string');
    if (!slideContent) continue;

    const relsFile = slideFile.replace('.xml', '.xml.rels')
      .replace('slides/', 'slides/_rels/');
    const relsContent = await pptx.file(relsFile)?.async('string');
    if (!relsContent) continue;

    const images = parseImageCrops(slideContent, relsContent);
    cropInfos.push(...images);
  }

  return cropInfos;
}

function parseImageCrops(slideContent: string, relsContent: string): CropInfo[] {
  const cropInfos: CropInfo[] = [];
  
  // Find all blip elements with their rIds
  const blipRegex = /<a:blip[^>]+r:embed="(rId\d+)"[^>]*>/g;
  let blipMatch;
  
  while ((blipMatch = blipRegex.exec(slideContent)) !== null) {
    const rId = blipMatch[1];
    
    // Find srcRect for this blip
    const srcRectRegex = new RegExp(
      `<a:blip[^>]+r:embed="${rId}"[^>]*>.*?<a:srcRect\\s+(?:l="(\\d+)")?\\s*(?:t="(\\d+)")?\\s*(?:r="(\\d+)")?\\s*(?:b="(\\d+)")?[^>]*>`,
      's'
    );
    const srcRectMatch = slideContent.match(srcRectRegex);
    
    if (srcRectMatch) {
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
        cropInfos.push({ imageFile, cropRect });
      }
    }
  }

  return cropInfos;
}