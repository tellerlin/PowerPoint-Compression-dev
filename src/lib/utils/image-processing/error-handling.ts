export class ImageProcessingError extends Error {
    constructor(message: string, public readonly originalError?: Error) {
        super(message);
        this.name = 'ImageProcessingError';
    }
}

export function handleImageError(error: unknown, imageName: string): ImageProcessingError {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return new ImageProcessingError(
        `Failed to process image ${imageName}: ${message}`,
        error instanceof Error ? error : undefined
    );
}

export function isProcessableImage(filename: string): boolean {
    return /\.(png|jpg|jpeg|gif)$/i.test(filename);
}