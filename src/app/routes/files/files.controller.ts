import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Put,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, } from '@nestjs/swagger';

import { Express, } from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer, } from 'multer';

import File from '../../database/entity/file.entity';

import { FileEditDto, FileInfoDto, FileListDto, } from './file-info.dto';
import FilesService from './files.service';

@ApiTags('files')
@Controller('files')
export default class UsersController {
	@Inject(FilesService)
	private readonly _service: FilesService;

	@Get()
	@ApiOperation({
		description: 'Use this endpoint to list files',
	})
	async listFiles(@Query() listParam: FileListDto): Promise<[FileInfoDto[], number]> {
		const data = await this._service.list(listParam);
		return data;
	}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({
		description: 'This method allows to upload file',
	})
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<File> {
		return this._service.create(file);
	}

	@Put(':fileId')
	@ApiOperation({
		description: 'This method allows to upload new filename or public status',
	})
	async fileEdit(@Param('fileId') fileId: string, @Body() payload: FileEditDto): Promise<File> {
		return this._service.edit(fileId, payload);
	}

	@Get(':fileId')
	@ApiOperation({
		description: 'Use this endpoint to get file',
	})
	async retrieveFile(@Param('fileId') fileId: string): Promise<File> {
		const file = await this._service.retrieve(fileId);
		return file;
	}

	@Get(':fileId/info')
	@ApiOperation({
		description: 'Use this endpoint to get file info',
	})
	async retrieveFileInfo(@Param('fileId') fileId: string): Promise<FileInfoDto> {
		const file = await this._service.retrieveInfo(fileId);
		return file;
	}
}
