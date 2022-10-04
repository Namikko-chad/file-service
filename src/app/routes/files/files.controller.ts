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
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, } from '@nestjs/swagger';

import { Express, } from 'express'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer, } from 'multer';

import { JwtAccessGuard, } from '../../auth/guards/jwt-access.guard';

import File from '../../database/entity/file.entity';

import { FileEditDto, FileListDto, FileRetrieveDto, } from './files.dto';
import FilesService from './files.service';

@ApiTags('files')
@Controller('files')
export default class UsersController {
  @Inject(FilesService)
	private readonly _service: FilesService;

  @UseGuards(JwtAccessGuard)
  @Get()
  @ApiOperation({
  	description: 'Use this endpoint to get file',
  })
  async listFiles(@Query() listParam: FileListDto): Promise<[File[], number]> {
  	const data = await this._service.list(listParam);
  	return data;
  }

  @UseGuards(JwtAccessGuard)
  @Post()
	@UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
  	description: 'This method allows to upload file',
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<File> {
  	const data = await this._service.create(file);
  	return data;
  }

	@UseGuards(JwtAccessGuard)
  @Get('{fileId}')
  @ApiOperation({
  	description: 'Use this endpoint to get file',
  })
  async retrieveFile(@Param('fileId') fileId: string, @Query() _query: FileRetrieveDto): Promise<File> {
  	const file = await this._service.retrieve(fileId);
  	return file;
  }

  @UseGuards(JwtAccessGuard)
  @Put('{fileId}')
  @ApiOperation({
  	description: 'This method allows to upload new filename or public status',
  })
	async fileEdit(@Param('fileId') fileId: string, @Body() payload: FileEditDto): Promise<File> {
  	const file = await this._service.edit(fileId, payload);
  	return file;
	}
}
