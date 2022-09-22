import { Module, } from '@nestjs/common';
import { TypeOrmModule, } from '@nestjs/typeorm';

import JwtAccessStrategy from '../../auth/strategies/jwt-access.strategy';

import FileRepository from '../../database/repositories/file.repository';

import FilesController from './files.controller';
import FilesService from './files.service';

@Module({
	imports: [TypeOrmModule.forFeature([FileRepository])],
	controllers: [FilesController],
	providers: [FilesService, JwtAccessStrategy],
})
export default class FilesModule {}
