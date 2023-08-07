import { Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { DatabaseConfig, } from './storage.database.config';
import { Storage, } from './storage.database.entity';
import { StorageRepository, } from './storage.database.repository';
import { DBStorage, } from './storage.database.service';

@Module({
  imports: [TypeOrmModule.forFeature([Storage])],
  providers: [
    ConfigService,
    DatabaseConfig,
    StorageRepository,
    DBStorage
  ],
  exports: [DBStorage],
})
export class StorageDatabaseModule {}
