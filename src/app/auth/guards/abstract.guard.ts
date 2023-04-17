import { CanActivate, ExecutionContext, UnauthorizedException, } from '@nestjs/common';
import { Reflector, } from '@nestjs/core';
import { Exception, } from 'app/utils/Exception';
import { Request, } from 'express';
import * as jwt from 'jsonwebtoken';

import { IS_PUBLIC_KEY, IS_TRY, } from '../auth.decorators';

interface IJwtData {
	userId: string;
	fileId?: string;
	timestamp: number;
}

export abstract class AbstractGuard implements CanActivate {
	abstract secretKey: string;
	abstract extractor: (request: Request) => string | undefined;

	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		if (isPublic) {
			return true;
		}
		const isTry = this.reflector.getAllAndOverride<boolean>(IS_TRY, [
			context.getHandler(),
			context.getClass()
		]);
		const request = context.switchToHttp().getRequest<Request>();
		const token = this.extractor(request);
		let data: IJwtData;
		try {
			data = this.decodeJwt(token);
		} catch (error) {
			if (error instanceof jwt.JsonWebTokenError && !isTry)
				throw new Exception(error.name === 'TokenExpiredError' ? 401001 : 401002,
					error.name === 'TokenExpiredError' ? 'Token expired' : 'Token invalid')
		}
		console.log(data)
		return true;
		// throw new UnauthorizedException();
	}

	handleRequest(err, user) {
		if (err || !user) {
			throw err || new UnauthorizedException();
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return user;
	}

	static extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}

	static extractTokenFromQuery(request: Request): string | undefined {
		const token = request.query['access_token'] as string;
		return token;
	}

	private decodeJwt(token: string): IJwtData {
		return jwt.verify(token, this.secretKey) as IJwtData;
	}
}
