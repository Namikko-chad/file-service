import { Global, Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { databaseConfig, } from './database.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...databaseConfig(config),
      }),
    })
  ],
})
export class DatabaseModule {}
