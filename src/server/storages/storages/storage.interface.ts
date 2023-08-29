export interface StorageParam {
  enabled: boolean;
  fileSizeLimit: number;
  capacity: number;
}

export interface FileFormData {
  filename: string;
  headers: object;
  payload: Buffer;
}

export interface IFilename {
  name: string;
  ext: string;
}
