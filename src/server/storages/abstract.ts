import { FilePayload, StorageParam, } from './interface';
import { StorageType, } from './enum';
import { File, } from '../db';

export abstract class AbstractStorage {
	abstract params: StorageParam;
	abstract type: StorageType | string;

	abstract saveFile(file: File, data: FilePayload): Promise<void>;

	abstract loadFile(file: File): Promise<Buffer>;
	
	abstract deleteFile(file: File): Promise<void>;
}
