import { Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { JwtService, } from '@nestjs/jwt';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { File, } from '../files/entity';
import { FileRepository, } from '../files/repositories';
import { StorageConfig, } from './storage.config';
import { StorageService, } from './storage.service';
import { StorageDatabaseModule, } from './storages/database/storage.database.module';
import { StorageFolderModule, } from './storages/folder/storage.folder.module';
import { GoogleDriveModule, } from './storages/google-drive/storage.google-drive.module';
import { MegaIOModule, } from './storages/mega-io/storage.mega-io.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), StorageDatabaseModule, GoogleDriveModule, StorageFolderModule, MegaIOModule],
  providers: [
    ConfigService, 
    JwtService, 
    StorageConfig, 
    FileRepository, 
    StorageService
  ],
  exports: [StorageService],
})
export class StorageModule {}
