/* eslint-disable @typescript-eslint/require-await */
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
import { File, } from 'app/database';
import { ListDto, } from 'app/dto';

import { Express, } from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer, } from 'multer';
import { FileEditDto, FileInfoDto, } from './dto';

import FilesService from './files.service';

const file: FileInfoDto = {
	id: '3fa78d9f-1624-4bb1-9392-7728ed4c84ed',
	name: 'id_rsa',
	ext: 'txt',
	mime: 'text/plain',
	size: '584',
	public: false,
	userId: 'fb5b7f7d-0e12-40d4-90aa-b20d315f2faf',
	hash: 'c111d66a1a8d33e228dc8b08471df8ed',
}

@ApiTags('files')
@Controller('files')
export default class UsersController {
	@Inject(FilesService)
	private readonly _service: FilesService;

	@Get()
	@ApiOperation({
		description: 'Use this endpoint to list files',
	})
	async listFiles(@Query() listParam: ListDto): Promise<[FileInfoDto[], number]> {
		// const [files, count] = await this._service.list(listParam);
		console.log(listParam)
		return [[file], 1];
	}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({
		description: 'This method allows to upload file',
	})
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<File> {
		console.log(file)
		return new File();
	}

	@Put(':fileId')
	@ApiOperation({
		description: 'This method allows to upload new filename or public status',
	})
	async fileEdit(@Param('fileId') fileId: string, @Body() payload: FileEditDto): Promise<FileInfoDto> {
		console.log(fileId, payload)
		return file;
	}

	@Get(':fileId')
	@ApiOperation({
		description: 'Use this endpoint to get file',
	})
	async retrieveFile(@Param('fileId') fileId: string): Promise<Buffer> {
		const file = await this._service.retrieve(fileId);
		return file.file.data;
	}

	@Get(':fileId/info')
	@ApiOperation({
		description: 'Use this endpoint to get file info',
	})
	async retrieveFileInfo(@Param('fileId') fileId: string): Promise<FileInfoDto> {
		console.log(fileId)
		// const file = await this._service.retrieveInfo(fileId);
		return file;
	}
}
