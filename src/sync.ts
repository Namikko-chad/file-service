import { DataSource, } from 'typeorm';

import { loadDatabaseConfig, entities, } from './app/database';

const config = loadDatabaseConfig();

async function init() {
	const dataSource = new DataSource({
		type: 'postgres',
		url: config.link,
		entities,
		synchronize: true,
	})
	await dataSource.initialize();
	console.log('Database sync complete');
}

init().catch( (error) => console.log(error) );
