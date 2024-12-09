export function createWorker(fn: Function): Worker {
    const blob = new Blob(
        [`self.onmessage = async (e) => { self.postMessage(await (${fn.toString()})(e.data)); }`],
        { type: 'text/javascript' }
    );
    return new Worker(URL.createObjectURL(blob));
}

export function terminateWorker(worker: Worker): void {
    worker.terminate();
    if (worker.objectURL) {
        URL.revokeObjectURL(worker.objectURL);
    }
}