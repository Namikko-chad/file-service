import { File, } from '../../files/entity';
import { StorageType, } from '../storage.enum';
import { StorageParam, } from '../storage.interface';

export abstract class AbstractStorage {
  abstract params: StorageParam;
  abstract type: StorageType;

  abstract saveFile(file: File, data: Buffer): Promise<void>;

  abstract loadFile(file: File): Promise<Buffer>;

  abstract deleteFile(file: File): Promise<void>;
}
