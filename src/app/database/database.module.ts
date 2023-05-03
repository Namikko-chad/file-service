import { Global, Module, } from '@nestjs/common';
import { ConfigModule, ConfigService, } from '@nestjs/config';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { databaseConfig, } from './database.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...databaseConfig(config),
      }),
    })
  ],
})
export class DatabaseModule {}
