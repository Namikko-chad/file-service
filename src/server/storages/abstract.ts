<<<<<<< HEAD
import { FilePayload, StorageParam, } from './interface';
import { StorageType, } from './enum';
=======
import { Sequelize, } from 'sequelize-typescript';

>>>>>>> 35e75f8c834ab18aa28b9f1cbdea578849276554
import { File, } from '../db';
import { StorageType, } from './enum';
import { StorageParam, } from './interface';

export abstract class AbstractStorage {
  abstract params: StorageParam;
  abstract type: StorageType;

  abstract init(db: Sequelize): void | Promise<void>;

  abstract saveFile(file: File, data: Buffer): Promise<void>;

  abstract loadFile(file: File): Promise<Buffer>;

  abstract deleteFile(file: File): Promise<void>;
}
