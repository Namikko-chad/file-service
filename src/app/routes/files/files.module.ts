import { Module, } from '@nestjs/common';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { FileRepository, FileUserRepository, } from 'app/database';

import JwtAccessStrategy from '../../auth/strategies/jwt-access.strategy';

import FilesController from './files.controller';
import FilesService from './files.service';

@Module({
	imports: [TypeOrmModule.forFeature([FileRepository, FileUserRepository])],
	controllers: [FilesController],
	providers: [FilesService, JwtAccessStrategy],
})
export default class FilesModule {}
