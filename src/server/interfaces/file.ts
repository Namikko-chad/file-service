import { FileFormData, } from '../storages';

export interface IFileGuid {
  id: string;
}

export interface IFilename {
  name: string;
  ext: string;
}

export interface IFileCreatePayload {
  file?: FileFormData;
}

export interface IFileEditPayload {
  file?: {
    filename: string;
    headers: object;
    payload: Buffer;
  };
  public?: boolean;
  name?: string;
}

export type IFileResponse = 
  IFileGuid &
  IFilename & {
    mime: string;
    public: boolean;
    userId: string;
    hash: string;
  };
