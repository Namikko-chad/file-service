import { StorageType, } from './enum';

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
