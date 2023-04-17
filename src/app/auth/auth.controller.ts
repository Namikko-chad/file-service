import {
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags, } from '@nestjs/swagger';
import { Exception, } from 'app/utils/Exception';
import { AuthPublic, } from './auth.decorators';
import { AuthService, } from './auth.service';

enum TokenType {
	File = 'file',
	User = 'user',
	Admin = 'admin',
}

class ParamsDTO {
	tokenType!: TokenType
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	// @ts-ignore
	constructor(private readonly _service: AuthService) {}

	@Post('token/generate/:tokenType')
	@ApiOperation({
		summary: 'Generate token for authorization',
	})
	@AuthPublic()
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
	tokenGenerate(@Param() params: ParamsDTO): string {
		console.log(params)
		throw new Exception(HttpStatus.NOT_IMPLEMENTED, 'Route not implemented')
	}

	@Get('token/info/:tokenType')
	@ApiOperation({
		summary: 'Use this endpoint to decode token',
	})
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
	tokenInfo(@Param() params: ParamsDTO): unknown {
		console.log(params)
		throw new Exception(HttpStatus.NOT_IMPLEMENTED, 'Route not implemented')
	}

	@Get('token/validate/:tokenType')
	@ApiOperation({
		summary: 'Use this endpoint to validate token',
	})
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
	tokenValidate(@Param() params: ParamsDTO): void {
		console.log(params)
		throw new Exception(HttpStatus.NOT_IMPLEMENTED, 'Route not implemented')
	}
}
