import { Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { JwtModule, } from '@nestjs/jwt';

import { AuthConfig, } from './auth.config';
import { AuthController, } from './auth.controller';
import { AuthService, } from './auth.service';
import { AdminAccessGuard, } from './guards/admin.guard';
import { FileAccessGuard, } from './guards/file.guard';
import { UserAccessGuard, } from './guards/user.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [ConfigService, AuthConfig, AuthService, AdminAccessGuard, UserAccessGuard, FileAccessGuard],
  exports: [AuthService, AdminAccessGuard, UserAccessGuard, FileAccessGuard],
})
export class AuthModule {}
