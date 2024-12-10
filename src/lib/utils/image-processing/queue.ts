export interface Task {
    (): Promise<void>;
}

export function createImageProcessingQueue(concurrency: number) {
    const queue: Task[] = [];
    let running = 0;

    async function runTask(task: Task) {
        running++;
        try {
            await task();
        } finally {
            running--;
            if (queue.length > 0 && running < concurrency) {
                const nextTask = queue.shift();
                if (nextTask) runTask(nextTask);
            }
        }
    }

    return {
        add(task: Task): Promise<void> {
            return new Promise((resolve, reject) => {
                const wrappedTask = async () => {
                    try {
                        await task();
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                };

                if (running < concurrency) {
                    runTask(wrappedTask);
                } else {
                    queue.push(wrappedTask);
                }
            });
        }
    };
}