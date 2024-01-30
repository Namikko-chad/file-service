import { Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';

import { DatabaseService, } from '../../../database';
import { DatabaseConfig, } from './storage.database.config';
import { DBStorage, } from './storage.database.service';

@Module({
  providers: [
    ConfigService,
    DatabaseConfig,
    DatabaseService,
    DBStorage
  ],
  exports: [DBStorage],
})
export class StorageDatabaseModule {}
