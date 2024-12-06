export namespace Events {
	export interface FileSelectedEvent {
			file: File;
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
}