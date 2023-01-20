import { Sequelize, SequelizeOptions, } from 'sequelize-typescript';
import { DatabaseOptions, } from './interface';
import { File, FileUser, } from './models';

export async function initDatabase(config: DatabaseOptions, sync = false): Promise<Sequelize> {
	let forceSync = false;
	if (!config.link && !config.host) throw new Error('Database not configured');
	const options: SequelizeOptions = {
		models: [File, FileUser],
		logging: config.logging,
		pool: {
			acquire: 9000000,
			max: 15,
		},
	};
	let uri = config.link
		? config.link
		: // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		  `${config.dialect}://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
	if (config.test && config.test_link) {
		uri = 'sqlite::memory';
		options.dialect = 'sqlite';
		options.models = [File, FileUser];
		forceSync = true;
	}
	const sequelize = new Sequelize(uri, options);
	if (sequelize && (sync || forceSync)) {
		await sequelize.sync();
	}
	return sequelize;
}
