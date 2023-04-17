import {
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	Body,
	Res,
	StreamableFile,
	UsePipes,
	ValidationPipe,
	UploadedFile,
	UseInterceptors,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { FileInterceptor, } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer, } from 'multer';
import { ListDto, } from 'app/dto';
import { Express, Response, } from 'express';
import { FileEditDto, FileInfoDto, } from './dto';
import { FileService, } from './files.service';
import { FileUser, } from './entity';
import { Utils, } from 'app/utils/utils';
import { Exception, } from 'app/utils/Exception';
import { AuthTry, } from 'app/auth/auth.decorators';
import { AdminAccessGuard, } from 'app/auth/guards/admin.guard';
import { UserAccessGuard, } from 'app/auth/guards/user.guard';

class QueryDTO {
	fileId: string;
}

@ApiTags('files')
@Controller('files')
export class FileController {
	constructor(private readonly _service: FileService) {}

	@Get()
	@ApiOperation({
		summary: 'Use this endpoint to lis`t file',
	})
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
	async list(
		@Query() listParam: ListDto<FileUser>
	): Promise<{ count: number; rows: FileInfoDto[] }> {
		const [files, count] = await this._service.list(listParam);
		return { count, rows: files.map((file) => this._service.fileResponse(file)), };
	}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({
		summary: 'Use this endpoint to upload file',
	})
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileInfoDto> {
		console.log(file)
		await Utils.delay(1000);
		throw new Exception(HttpStatus.NOT_IMPLEMENTED, 'Route not implemented')
	}

	@Get(':fileId')
	@ApiOperation({
		summary: 'Use this endpoint to get file',
	})
	@AuthTry()
	async retrieveFile(@Param() params: QueryDTO, @Res({ passthrough: true, }) res: Response): Promise<StreamableFile> {
		const fileUser = await this._service.retrieve(params.fileId);
		res.set({
			'Content-Type': fileUser.file.mime,
			'Content-Length': fileUser.file.size,
			'Content-Disposition': 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(fileUser.name + '.' + fileUser.file.ext),
		});
		return new StreamableFile(fileUser.file.data)
	}

	@Put(':fileId')
	@ApiOperation({
		summary: 'Use this endpoint to upload new filename or public status',
	})
	async fileEdit(@Param() params: QueryDTO, @Body() payload: FileEditDto): Promise<FileInfoDto> {
		console.log(params, payload)
		await Utils.delay(1000);
		throw new Exception(HttpStatus.NOT_IMPLEMENTED, 'Route not implemented')
	}

	@Delete(':fileId')
	@ApiOperation({
		summary: 'Use this endpoint to delete file',
	})
	async fileDelete(@Param() params: QueryDTO): Promise<FileInfoDto> {
		console.log(params)
		await Utils.delay(1000);
		throw new Exception(HttpStatus.NOT_IMPLEMENTED, 'Route not implemented')
	}

	@Get(':fileId/info')
	@ApiOperation({
		summary: 'Use this endpoint to get information about file',
	})
	// @AuthTry()
	@UseGuards(AdminAccessGuard, UserAccessGuard)
	async retrieveInfo(@Param() params: QueryDTO): Promise<FileInfoDto> {
		const fileUser = await this._service.retrieveInfo(params.fileId);
		return this._service.fileResponse(fileUser);
	}
}
