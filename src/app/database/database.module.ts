import { Global, Module, } from '@nestjs/common';
import { TypeOrmModule, } from '@nestjs/typeorm';

import File from './entity/file.entity';

import { loadDatabaseConfig, } from './config';

const config = loadDatabaseConfig();

@Global()
@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: config.host,
			port: config.port,
			username: config.username,
			password: config.password,
			database: config.database,
			entities: [File],
			synchronize: false,
		})
	],
})
export default class DatabaseModule {}
