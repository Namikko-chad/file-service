import { FileStorage, } from '../db/models';
import { StorageType, } from '../enum';

export interface Storage {
	type: StorageType
	
	saveFile(file: FileFormData): Promise<FileStorage>
	loadFile(fileId: string): Promise<FileStorage>
	deleteFile(fileId: string): Promise<boolean>
}

export type StorageOptions = {
	readonly type: StorageType;
};

export interface FileFormData {
	filename: string;
	headers: object;
	payload: Buffer;
}