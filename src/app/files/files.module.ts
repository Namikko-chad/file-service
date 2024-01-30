import { Module, } from '@nestjs/common';

import { AdminAccessGuard, AuthConfig, FileAccessGuard, UserAccessGuard, } from '../auth';
import { StorageModule, } from '../storage';
import { FileConfig, } from './files.config';
import { FileController, } from './files.controller';
import { FileService, } from './files.service';
@Module({
  imports: [StorageModule],
  controllers: [FileController],
  providers: [
    FileConfig,
    FileService, 
    AuthConfig, 
    AdminAccessGuard, 
    UserAccessGuard, 
    FileAccessGuard
  ],
})
export class FileModule {}
