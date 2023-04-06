import { Sequelize, } from 'sequelize-typescript';
import { StorageParam, } from './interface';
import { StorageType, } from './enum';
import { File, } from '../db';

export abstract class AbstractStorage {
	abstract params: StorageParam;
	abstract type: StorageType;

	abstract init(db: Sequelize): void | Promise<void>;

	abstract saveFile(file: File, data: Buffer): Promise<void>;

	abstract loadFile(file: File): Promise<Buffer>;
	
	abstract deleteFile(file: File): Promise<void>;
}
