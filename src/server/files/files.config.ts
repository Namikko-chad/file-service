import { config as dotenv, } from 'dotenv';
import * as os from 'os';

dotenv();

function configLoad() {
  return {
    files: {
      allowedExtensions: process.env['FILETYPE'] ?? 'jpg|jpeg|png|gif|html|webp|pdf|docx|rtf|xls|xlsx|sig|svg|iso',
      allowedExtensionsRegExp: RegExp(`(${process.env['FILETYPE'] ?? 'jpg|jpeg|png|gif|html|webp|pdf|docx|rtf|xls|xlsx|sig|svg|iso'})$`),
      bufferSize: 1024 * 1024 * 1,
      bufferStorage: process.env['STORAGE_TEMP'] ?? os.tmpdir() + '/',
      capacityPerUser: 1024 * 1024 * 100,
      filesDir: 'assert',
      maxSize: 1024 * 1024 * 30,
    },
  };
}

export const filesConfig = configLoad();
