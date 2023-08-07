import { config, } from 'dotenv';

import { DatabaseOptions, } from './interface';

let databaseConfig: DatabaseOptions | undefined;

export function loadDatabaseConfig(): DatabaseOptions {
  if (!databaseConfig) {
    config();
    databaseConfig = {
      link: String(process.env['DATABASE_LINK']),
      host: String(process.env['DATABASE_HOST']),
      port: Number(process.env['DATABASE_PORT']),
      username: String(process.env['DATABASE_USERNAME']),
      password: String(process.env['DATABASE_PASSWORD']),
      database: String(process.env['DATABASE_NAME']),
      development: process.env['MODE'] === 'development' ? true : false,
      test: process.env['MODE'] === 'test' ? true : false,
      test_link: String(process.env['TEST_DATABASE_LINK']),
      logging: undefined,
    };
  }

  return databaseConfig;
}
