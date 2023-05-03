import { Injectable, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import * as os from 'os';

export interface StorageConfigInterface {
  allowedExtensions: string;
  allowedExtensionsRegExp: RegExp;
  bufferSize: number;
  bufferStorage: string;
  capacityPerUser: number;
  filesDir: string;
  maxSize: number;
}

@Injectable()
export class StorageConfig implements StorageConfigInterface {
  public allowedExtensions: string;
  public allowedExtensionsRegExp: RegExp;
  public bufferSize: number;
  public bufferStorage: string;
  public capacityPerUser: number;
  public filesDir: string;
  public maxSize: number;

  constructor(private readonly configService: ConfigService) {
    this.allowedExtensions = this.configService.get<string>('FILETYPE') ?? 'jpg|jpeg|png|gif|html|webp|pdf|docx|rtf|xls|xlsx|sig|svg|iso';
    this.allowedExtensionsRegExp = RegExp(this.allowedExtensions);
    this.bufferSize = 1024 * 1024 * 1;
    this.bufferStorage = this.configService.get<string>('STORAGE_TEMP') ?? os.tmpdir() + '/';
    this.capacityPerUser = 1024 * 1024 * 100;
    this.filesDir = 'assert';
    this.maxSize = 1024 * 1024 * 30 * 30000;
  }
}
