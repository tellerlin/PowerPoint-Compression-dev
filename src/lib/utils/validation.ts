export function validateFile(file: File): string | null {
    if (!file) {
        return 'No file selected';
    }

    if (!file.name.toLowerCase().endsWith('.pptx')) {
        return 'Only PowerPoint (.pptx) files are supported';
    }

    const MAX_SIZE = 300 * 1024 * 1024; // 300MB
    if (file.size > MAX_SIZE) {
        return `File size exceeds 300MB limit (Current size: ${(file.size / 1024 / 1024).toFixed(1)}MB)`;
    }

    if (file.size === 0) {
        return 'File appears to be empty';
    }

    return null;
}