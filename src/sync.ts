import { ConfigModule, ConfigService, } from '@nestjs/config';
import { DataSource, } from 'typeorm';

import { databaseConfig, } from './app/database/database.config';

async function init() {
  ConfigModule.forRoot();
  const config = new ConfigService();
  const dataSource = new DataSource({
    ...databaseConfig(config),
    entities: ['dist/**/*.entity.js'],
  });
  await dataSource.initialize();
  await Promise.all(
    ['public', 'logs'].map( async (schema) => dataSource.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`) )
  );
  await dataSource.synchronize();
  console.log('Database sync complete');
}

init().catch((error) => console.log(error));
