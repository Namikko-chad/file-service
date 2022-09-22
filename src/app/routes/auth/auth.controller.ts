import { Body, Controller, Inject, Post, } from '@nestjs/common';
import { ApiOperation, ApiTags, } from '@nestjs/swagger';

import AuthService from './auth.service';

import { LoginDto, } from './auth.dto';

@ApiTags('v1', 'auth')
@Controller('v1/auth')
export default class AuthController {
  @Inject(AuthService)
	private readonly _service: AuthService;

  @Post('sign_in')
  @ApiOperation({
  	description: 'Login',
  })
  async login(@Body() user: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
  	const data = await this._service.login(user);
  	return data;
  }
}
