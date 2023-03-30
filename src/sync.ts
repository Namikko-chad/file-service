import { initDatabase, loadDatabaseConfig, } from './server/db';

async function init() {
	await initDatabase(
		{
			...loadDatabaseConfig(),
			dialect: 'postgres',
		},
		true
	);
	console.log('Database sync complete');
}

init().catch((error) => console.error(error));
