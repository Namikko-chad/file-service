import { Module, } from '@nestjs/common';
import { ConfigModule, } from '@nestjs/config';
// import { APP_GUARD, } from '@nestjs/core';
// import { AuthConfig, } from './auth/auth.config';
import { AuthModule, } from './auth/auth.module';
// import { AdminAccessGuard, } from './auth/guards/admin.guard';
import { ControlModule, } from './control/control.module';
import { DatabaseModule, } from './database/database.module';
import { FileModule, } from './files/files.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		DatabaseModule, AuthModule, FileModule, ControlModule],
	providers: [
		// AuthConfig, 
		// {
		// 	provide: APP_GUARD,
		// 	useClass: AdminAccessGuard,
		// }
	],
})
export class AppModule {}
