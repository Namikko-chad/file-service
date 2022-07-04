import { Sequelize, SequelizeOptions, } from 'sequelize-typescript';
import { Dialect, } from 'sequelize';
import { config, } from '../config/config';
import { File, } from './File';
import { FileStorage, } from './FileStorage';

export { File, } from './File';
export { FileStorage, Storage, } from './FileStorage';

export interface connParam {
  logging?: boolean;
  dialect?: Dialect;
  storage?: string;
  sync?: boolean;
}

export async function initDatabase({
	sync = true,
	logging = false,
}: connParam): Promise<Sequelize> {
	let uri = config.dbLink;
	let forcesync = false;
	const options: SequelizeOptions = {
		logging,
		models: [File, FileStorage],
	};

	if (config.test) {
		uri = 'sqlite::file';
		options.storage = 'db.sqlite';
		options.dialect = 'sqlite';
		options.models = [File, FileStorage];
		forcesync = true;
	}
	const sequelize = new Sequelize(uri, options);
	if (sequelize && (sync || forcesync)) {
		await sequelize.sync();
	}

	return sequelize;
}
