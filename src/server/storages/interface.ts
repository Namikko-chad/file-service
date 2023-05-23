import fs from 'fs';
import { StorageType, } from './enum';

export interface StorageParam {
  fileSizeLimit: number;
}

export type StorageOptions = {
  readonly type: StorageType;
};

export interface FilePayload {
  headers: object;
	start: number;
  name: string;
  ext?: string;
	mime?: string;
	hash?: string;
	length: number;
	multipart: boolean;
	payload?: Buffer;
	path?: fs.PathLike;
	storage?: fs.WriteStream;
}
