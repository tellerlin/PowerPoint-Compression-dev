import { writable } from 'svelte/store';
import type { CompressionProgress, CompressionResult } from '$lib/types';

export const compressionProgress = writable<CompressionProgress>({
	progress: 0,
	status: ''
});

export const compressionResult = writable<CompressionResult>({
	originalSize: 0,
	compressedSize: 0,
	downloadUrl: ''
});