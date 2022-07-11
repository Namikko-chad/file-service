import { StorageType, } from '../enum';
import { DBStorage, } from './storages.DB';
import { FolderStorage, } from './storages.Folder';
import { Storage as IStorage, StorageOptions, } from './interface';

export class Storage {
	static init(options?: StorageOptions): IStorage {
		switch (options?.type) {
		case StorageType.FOLDER:
			return new FolderStorage();
		case StorageType.DB:
		default:
			return new DBStorage();
		}
	}
}
