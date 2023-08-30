
export interface StorageParam {
  fileSizeLimit: number;
}

export interface FileFormData {
  filename: string;
  headers: object;
  payload: Buffer;
}
