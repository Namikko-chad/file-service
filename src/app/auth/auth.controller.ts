import {
	Body,
	Controller,
	Get,
	Headers,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags, } from '@nestjs/swagger';
import { AuthPublic, } from './auth.decorators';
import { AuthService, } from './auth.service';
import { AuthBodyDTO, AuthParamsDTO, } from './auth.dto';
import { MultipleAuthorizeGuard, MultipleGuardsReferences, } from './guards/multiple.guard';
import { AdminAccessGuard, } from './guards/admin.guard';
import { UserAccessGuard, } from './guards/user.guard';
import { FileAccessGuard, } from './guards/file.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly _service: AuthService) {}

	@Post('token/generate/:tokenType')
	@ApiOperation({
		summary: 'Generate token for authorization',
	})
	@AuthPublic()
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
	tokenGenerate(@Param() params: AuthParamsDTO, @Body() payload: AuthBodyDTO): { token: string; } {
		return {
			token: this._service.createToken(params.tokenType, payload.userId, payload.fileId),
		}
	}

	@Get('token/info/:tokenType')
	@ApiOperation({
		summary: 'Use this endpoint to decode token',
	})
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
	tokenInfo(@Param() params: AuthParamsDTO, @Headers() headers: Record<string, string>): unknown {
		return this._service.decodeToken(params.tokenType, headers['authorization'].slice(7))
	}

	@Get('token/validate/:tokenType')
	@ApiOperation({
		summary: 'Use this endpoint to validate token',
	})
	@MultipleGuardsReferences(AdminAccessGuard, UserAccessGuard, FileAccessGuard)
	@UseGuards(MultipleAuthorizeGuard)
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	tokenValidate(): void {}
}
