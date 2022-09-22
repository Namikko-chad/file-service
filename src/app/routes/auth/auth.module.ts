import { Module, } from '@nestjs/common';
import { JwtModule, } from '@nestjs/jwt';
import { TypeOrmModule, } from '@nestjs/typeorm';

import UserRepository from '../../database/repositories/file.repository';

import AuthController from './auth.controller';
import AuthService from './auth.service';

@Module({
	imports: [JwtModule.register({}), TypeOrmModule.forFeature([UserRepository])],
	controllers: [AuthController],
	providers: [AuthService],
})
export default class AuthModule {}
