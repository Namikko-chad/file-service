import { Module, } from '@nestjs/common';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { AuthConfig, } from 'app/auth/auth.config';
import { AdminAccessGuard, } from 'app/auth/guards/admin.guard';
import { File, FileUser, } from './entity';
import { FileController, } from './files.controller';
import { FileService, } from './files.service';
import { FileRepository, FileUserRepository, } from './repositories';

@Module({
	imports: [TypeOrmModule.forFeature([File, FileUser])],
	controllers: [FileController],
	providers: [FileRepository, FileUserRepository, FileService, AuthConfig, AdminAccessGuard],
	exports: [FileService],
})
export class FileModule {}
