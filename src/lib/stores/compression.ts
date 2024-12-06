import { writable } from 'svelte/store';
import { browser } from '$app/environment';


function createCompressionProgressStore() {
    const { subscribe, set } = writable({
        progress: 0,
        status: ''
    });


    return {
        subscribe,
        set: (value) => {
            if (browser) set(value);
        },
        reset: () => {
            if (browser) set({ progress: 0, status: '' });
        }
    };
}


function createCompressionResultStore() {
    const { subscribe, set } = writable({
        originalSize: 0,
        compressedSize: 0,
        downloadUrl: ''
    });


    return {
        subscribe,
        set: (value) => {
            if (browser) set(value);
        },
        reset: () => {
            if (browser) set({
                originalSize: 0,
                compressedSize: 0,
                downloadUrl: ''
            });
        }
    };
}


export const compressionProgress = createCompressionProgressStore();
export const compressionResult = createCompressionResultStore();