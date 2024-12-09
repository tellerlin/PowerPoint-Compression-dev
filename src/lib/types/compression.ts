export interface ImageCompressionOptions {
    quality: number;
}

export interface CompressionProgress {
    progress: number;
    status: string;
}

export interface CompressionResult {
    originalSize: number;
    compressedSize: number;
    downloadUrl: string;
}