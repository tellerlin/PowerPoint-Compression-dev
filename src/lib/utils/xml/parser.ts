interface XMLNode {
  tagName: string;
  attributes: { [key: string]: string };
  children: XMLNode[];
}

export function parseXML(xmlString: string): XMLNode[] {
  const cleanXML = xmlString.trim();
  const nodes: XMLNode[] = [];
  let currentIndex = 0;

  while (currentIndex < cleanXML.length) {
    const nextTag = findNextTag(cleanXML, currentIndex);
    if (!nextTag) break;

    const { tagContent, endIndex } = nextTag;
    if (tagContent.startsWith('?') || tagContent.startsWith('!')) {
      currentIndex = endIndex;
      continue;
    }

    const node = parseTag(tagContent);
    if (node) nodes.push(node);
    currentIndex = endIndex;
  }

  return nodes;
}

function findNextTag(xml: string, startIndex: number): { tagContent: string; endIndex: number } | null {
  const start = xml.indexOf('<', startIndex);
  if (start === -1) return null;
  
  const end = xml.indexOf('>', start);
  if (end === -1) return null;

  return {
    tagContent: xml.substring(start + 1, end),
    endIndex: end + 1
  };
}

function parseTag(tagContent: string): XMLNode | null {
  const parts = tagContent.split(/\s+/);
  if (parts.length === 0) return null;

  const tagName = parts[0];
  const attributes: { [key: string]: string } = {};

  for (let i = 1; i < parts.length; i++) {
    const attrMatch = parts[i].match(/([^=]+)="([^"]*)"/);
    if (attrMatch) {
      attributes[attrMatch[1]] = attrMatch[2];
    }
  }

  return {
    tagName,
    attributes,
    children: []
  };
}

export function findElements(nodes: XMLNode[], tagName: string): XMLNode[] {
  const results: XMLNode[] = [];
  
  for (const node of nodes) {
    if (node.tagName === tagName) {
      results.push(node);
    }
    if (node.children.length > 0) {
      results.push(...findElements(node.children, tagName));
    }
  }

  return results;
}

export function getAttribute(node: XMLNode, name: string): string | null {
  return node.attributes[name] || null;
}