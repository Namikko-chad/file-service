import {
	Body,
	Controller,
	Get,
	Inject,
	Post,
	Put,
	Request,
	UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags, } from '@nestjs/swagger';

import { JwtAccessGuard, } from '../../auth/guards/jwt-access.guard';
import File from '../../database/entity/file.entity';

import User from '../../database/entity/file.entity';

import { FileEditDto, } from './files.dto';
import UsersService from './files.service';

@ApiTags('files')
@Controller('files')
export default class UsersController {
  @Inject(UsersService)
	private readonly _service: UsersService;

  @Post()
  @ApiOperation({
  	description: 'This method allows to upload file',
  })
  async userCreate(@Body() user: UserCreateDto): Promise<File> {
  	const data = await this._service.create(user);
  	return data;
  }

  @Put()
  @ApiOperation({
  	description: 'This method allows to upload new filename or public statususer',
  })
  async fileEdit(@Body() payload: FileEditDto): Promise<File> {
  	const data = await this._service.create(user);
  	return data;
  }

  @UseGuards(JwtAccessGuard)
  @Get('profile')
  @ApiOperation({
  	description: 'Get profile',
  })
  @ApiBearerAuth()
  async profile(@Request() req): Promise<User> {
  	const user = <User>req.user;

  	const profile = await this._service.profile(user.id);
  	return profile;
  }
}
