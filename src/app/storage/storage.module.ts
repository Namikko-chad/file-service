import { Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { File, } from '../files/entity';
import { FileRepository, } from '../files/repositories';
import { StorageConfig, } from './storage.config';
import { StorageService, } from './storage.service';
import { DBStorage, } from './storages/database/storage.database';
import { Storage, } from './storages/database/storage.entity';
import { StorageRepository, } from './storages/database/storage.repository';
import { FolderStorage, } from './storages/storage.Folder';

@Module({
  imports: [TypeOrmModule.forFeature([File, Storage])],
  providers: [ConfigService, StorageConfig, FileRepository, StorageRepository, FolderStorage, DBStorage, StorageService],
  exports: [StorageService],
})
export class StorageModule {}
