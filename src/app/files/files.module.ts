import { Module, } from '@nestjs/common';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { AuthConfig, } from '../auth/auth.config';
import { AdminAccessGuard, } from '../auth/guards/admin.guard';
import { FileAccessGuard, } from '../auth/guards/file.guard';
import { UserAccessGuard, } from '../auth/guards/user.guard';
import { StorageModule, } from '../storage/storage.module';
import { File, FileUser, } from './entity';
import { FileController, } from './files.controller';
import { FileService, } from './files.service';
import { FileRepository, FileUserRepository, } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([File, FileUser]), StorageModule],
  controllers: [FileController],
  providers: [FileRepository, FileUserRepository, FileService, AuthConfig, AdminAccessGuard, UserAccessGuard, FileAccessGuard],
})
export class FileModule {}
