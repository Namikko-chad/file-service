import { File, } from '../db';
import { StorageType, } from './enum';

export interface Storage {
	saveFile(file: FileFormData): Promise<File>;
	loadFile(file: File): Promise<Buffer>;
	deleteFile(file: File): Promise<void>;
}

export interface StorageParam {
	fileSizeLimit: number;
}

export type StorageOptions = {
	readonly type: StorageType;
};

export interface FileFormData {
	filename: string;
	headers: object;
	payload: Buffer;
}
