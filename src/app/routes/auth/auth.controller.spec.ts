import { HttpException, HttpStatus, } from '@nestjs/common';

import { JwtModule, JwtService, } from '@nestjs/jwt';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { Test, TestingModule, } from '@nestjs/testing';

import config from '../../config/config';

import DatabaseModule from '../../database/database.module';
import UserRepository from '../../database/repositories/file.repository';

import Utils from '../../utils/utils';

import { AuthServiceErrors, } from './auth.service';

import AuthController from './auth.controller';
import AuthService from './auth.service';

import { LoginDto, } from './auth.dto';

import { JwtPayload, } from '../../auth/strategies/jwt-access.strategy';

interface SignInOptions {
  isBadUser?: boolean;
}

class AuthModuleTest {
	private _app: TestingModule;
	private _controller: AuthController;

	private _repository: UserRepository;
	private _jwtService: JwtService;

	run(): void {
		beforeEach(async () => {
			this._app = await Test.createTestingModule({
				imports: [
					DatabaseModule,
					JwtModule.register({
						secret: config.auth.jwt.access.secret,
						signOptions: {
							expiresIn: config.auth.jwt.access.lifetime,
						},
					}),
					TypeOrmModule.forFeature([UserRepository])
				],
				controllers: [AuthController],
				providers: [AuthService],
			}).compile();

			this._controller = this._app.get<AuthController>(AuthController);
			this._repository = this._app.get<UserRepository>(UserRepository);
			this._jwtService = this._app.get<JwtService>(JwtService);
		});

		afterEach(async () => {
			this._app.close();
		});

		describe('Auth module', () => {
			describe('Sign in', () => {
				this.signIn({});
				this.signIn({
					isBadUser: true,
				});
			});
		});
	}

	signIn(options: SignInOptions): void {
		let info = 'Should login user';

		if (options.isBadUser) {
			info = 'Should throw "Wrong password"';
		}

		it(info, async () => {
			const user = this._repository.create({
				email: `${Utils.getUUID()}@email.com`,
				password: 'password',
				firstname: 'firstname',
				lastname: 'lastname',
			});

			const password = user.password;

			await this._repository.save(user);

			const payload: LoginDto = {
				email: user.email,
				password: options.isBadUser ? Utils.getUUID() : password,
			};

			try {
				const response = await this._controller.login(payload);

				if (options.isBadUser) {
					throw new Error('Bad user case error');
				}

				expect(typeof response.accessToken).toBe('string');
				expect(typeof response.refreshToken).toBe('string');

				const jwtPayload = <JwtPayload>(
          this._jwtService.decode(response.accessToken)
        );
				expect(jwtPayload.id).toBe(user.id);
			} catch (err) {
				if (!(err instanceof HttpException)) {
					throw err;
				}

				if (options.isBadUser) {
					expect(err.getResponse()).toBe(AuthServiceErrors.WRONG_PASSWORD);
					expect(err.getStatus()).toBe(HttpStatus.FORBIDDEN);
				}
			}
		});
	}
}

const test = new AuthModuleTest();
test.run();
