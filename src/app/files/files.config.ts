import { Injectable, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';

export interface FileConfigInterface {
  allowedExtensions: string;
  allowedExtensionsRegExp: RegExp;
  maxSize: number;
}

@Injectable()
export class FileConfig implements FileConfigInterface {
  public allowedExtensions: string;
  public allowedExtensionsRegExp: RegExp;
  public maxSize: number;

  constructor(private readonly configService: ConfigService) {
    this.allowedExtensions = this.configService.get<string>('FILETYPE') ?? 'jpg|jpeg|png|gif|html|webp|pdf|docx|rtf|xls|xlsx|sig|svg|iso';
    this.allowedExtensionsRegExp = RegExp(this.allowedExtensions);
    this.maxSize = this.configService.get<number>('FILESIZE') ?? 1024 * 1024 * 30;
  }
}
