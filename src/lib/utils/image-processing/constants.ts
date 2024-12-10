export const IMAGE_CONSTANTS = {
    MAX_DIMENSION: {
        WIDTH: 1366,
        HEIGHT: 768
    },
    QUALITY: {
        DEFAULT: 0.8,
        MIN: 0.6,
        MAX: 0.9
    },
    FORMATS: {
        WEBP: 'image/webp',
        JPEG: 'image/jpeg'
    }
} as const;

export const COMPRESSION_SETTINGS = {
    BATCH_SIZE: 3,
    MAX_CONCURRENT_OPERATIONS: 2,
    MEMORY_THRESHOLD: 0.8,
    COOLDOWN_TIME: 1000
} as const;