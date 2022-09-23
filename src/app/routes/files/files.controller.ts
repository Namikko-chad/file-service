import {
	Body,
	Controller,
	Inject,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';

import { ApiOperation, ApiTags, } from '@nestjs/swagger';

import { JwtAccessGuard, } from '../../auth/guards/jwt-access.guard';

import File from '../../database/entity/file.entity';

import { FileEditDto, } from './files.dto';
import FilesService from './files.service';

@ApiTags('files')
@Controller('files')
export default class UsersController {
  @Inject(FilesService)
	private readonly _service: FilesService;

  @UseGuards(JwtAccessGuard)
  @Post()
  @ApiOperation({
  	description: 'This method allows to upload file',
  })
  async userCreate(@Body() file: FileEditDto): Promise<File> {
  	const data = await this._service.create(file);
  	return data;
  }

  @UseGuards(JwtAccessGuard)
  @Put()
  @ApiOperation({
  	description: 'This method allows to upload new filename or public statususer',
  })
  async fileEdit(@Body() file: FileEditDto): Promise<File> {
  	const data = await this._service.create(file);
  	return data;
  }
}
