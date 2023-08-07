import { Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';

import { FolderConfig, } from './storage.folder.config';
import { FolderStorage, } from './storage.folder.service';

@Module({
  imports: [],
  providers: [
    ConfigService,
    FolderConfig,
    FolderStorage
  ],
  exports: [FolderStorage],
})
export class StorageFolderModule {}
