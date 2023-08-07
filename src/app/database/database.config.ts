import { ConfigService, } from '@nestjs/config';
import { DataSourceOptions, } from 'typeorm/data-source/DataSourceOptions';

import { CustomNamingStrategy, } from './CustomNamingStrategy';

export function databaseConfig(configService: ConfigService): DataSourceOptions {
  return {
    namingStrategy: new CustomNamingStrategy(),
    type: 'postgres',
    
    url: configService.getOrThrow('DATABASE_LINK'),
    entities: ['src/app/**/*.entity.ts', 'dist/app/**/*.entity.js'],
    synchronize: configService.get<string>('MODE') === 'test',
    migrationsRun: false,
    logging: configService.get<string>('DEBUG') === 'true',
  };
}
