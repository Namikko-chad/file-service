import { Module, } from '@nestjs/common';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { AuthConfig, } from 'app/auth/auth.config';
import { AdminAccessGuard, } from 'app/auth/guards/admin.guard';
import { File, FileUser, } from './entity';
import { FileController, } from './files.controller';
import { FileService, } from './files.service';
import { FileRepository, FileUserRepository, } from './repositories';
import { StorageRepository, } from './repositories/storage.repository';
import { Storage, } from './entity/storage.entity';
import { UserAccessGuard, } from 'app/auth/guards/user.guard';
import { FileAccessGuard, } from 'app/auth/guards/file.guard';

@Module({
	imports: [TypeOrmModule.forFeature([File, FileUser, Storage])],
	controllers: [FileController],
	providers: [FileRepository, FileUserRepository, StorageRepository, FileService, AuthConfig, AdminAccessGuard, UserAccessGuard, FileAccessGuard],
	exports: [FileService],
})
export class FileModule {}
