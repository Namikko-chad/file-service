import { config, } from 'dotenv';

import { DatabaseOptions, } from './database.interface';

let databaseConfig: DatabaseOptions | undefined;

export function loadDatabaseConfig(): DatabaseOptions {
  if (!databaseConfig) {
    config();
    databaseConfig = {
      link: String(process.env['DATABASE_URL']),
      host: String(process.env['DATABASE_HOST']),
      port: Number(process.env['DATABASE_PORT']),
      username: String(process.env['DATABASE_USERNAME']),
      password: String(process.env['DATABASE_PASSWORD']),
      database: String(process.env['DATABASE_NAME']),
      development: process.env['NODE_ENV'] === 'development',
      test: process.env['NODE_ENV'] === 'test',
      test_link: String(process.env['TEST_DATABASE_URL']),
      logging: process.env['DEBUG'] === 'true',
    };
  }

  return databaseConfig;
}
