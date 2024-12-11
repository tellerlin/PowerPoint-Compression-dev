type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class DebugLogger {
    private static instance: DebugLogger;
    private isEnabled: boolean = true;
    private prefix: string = '[ByteSlim]';

    private constructor() {}

    static getInstance(): DebugLogger {
        if (!DebugLogger.instance) {
            DebugLogger.instance = new DebugLogger();
        }
        return DebugLogger.instance;
    }

    private formatMessage(level: LogLevel, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        let formattedMessage = `${this.prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`;
        if (data) {
            formattedMessage += '\n' + JSON.stringify(data, null, 2);
        }
        return formattedMessage;
    }

    log(level: LogLevel, message: string, data?: any) {
        if (!this.isEnabled) return;

        const formattedMessage = this.formatMessage(level, message, data);
        switch (level) {
            case 'error':
                console.error(formattedMessage);
                break;
            case 'warn':
                console.warn(formattedMessage);
                break;
            case 'debug':
                console.debug(formattedMessage);
                break;
            default:
                console.log(formattedMessage);
        }
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
    }
}

export const logger = DebugLogger.getInstance();