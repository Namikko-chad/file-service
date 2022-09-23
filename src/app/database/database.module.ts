import { Global, Module, } from '@nestjs/common';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { loadDatabaseConfig, } from './config';

import { entities, } from './entities';

const config = loadDatabaseConfig();

@Global()
@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			url: config.link,
			entities,
			synchronize: false,
		})
	],
})
export default class DatabaseModule {}
