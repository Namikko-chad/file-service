import { ConfigModule, ConfigService, } from '@nestjs/config';
import { DataSource, } from 'typeorm';

import { databaseConfig, } from './app/database/database.config';

async function init() {
  ConfigModule.forRoot();
  const config = new ConfigService();
  const dataSource = new DataSource({
    ...databaseConfig(config),
    migrations: ['migrations/*.js'],
    synchronize: true,
  });
  await dataSource.initialize();
  console.log('Database sync complete');
}

init().catch((error) => console.log(error));
