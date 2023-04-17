import { Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { JwtModule, } from '@nestjs/jwt';
import { AuthConfig, } from './auth.config';
import { AuthController, } from './auth.controller';
import { AuthService, } from './auth.service';

@Module({
	imports: [
		JwtModule.register({})
	],
	controllers: [
		AuthController 
	],
	providers: [
		ConfigService,
		AuthConfig,
		AuthService 
	],
	exports: [AuthService],
})
export class AuthModule {}
