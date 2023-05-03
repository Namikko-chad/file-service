import { ConfigService, } from '@nestjs/config';
import { DataSourceOptions, } from 'typeorm/data-source/DataSourceOptions';

import { CustomNamingStrategy, } from './CustomNamingStrategy';

export function databaseConfig(configService: ConfigService): DataSourceOptions {
  return {
    namingStrategy: new CustomNamingStrategy(),
    type: 'postgres',
    url: configService.getOrThrow('DATABASE_LINK'),
    entities: ['dist/app/**/*.entity.js'],
    synchronize: false,
    migrationsRun: false,
    logging: configService.get<string>('DEBUG') === 'true',
  };
}
