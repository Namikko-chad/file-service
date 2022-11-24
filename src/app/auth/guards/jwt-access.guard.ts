import { ExecutionContext, Injectable, UnauthorizedException, } from '@nestjs/common';

import { AuthGuard, } from '@nestjs/passport';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
	override canActivate(context: ExecutionContext) {
		return super.canActivate(context);
	}

	override handleRequest(err, user) {
		if (err || !user) {
			throw err || new UnauthorizedException();
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return user;
	}
}
