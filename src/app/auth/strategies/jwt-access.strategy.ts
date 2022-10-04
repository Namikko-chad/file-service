import { PassportStrategy, } from '@nestjs/passport';

import { ExtractJwt, Strategy, } from 'passport-jwt';

import config from '../../config/config';

export interface JwtPayload {
  userId: string;
  fileId?: string;
  timestamp: number;
}

export default class JwtHeaderStrategy extends PassportStrategy(
	Strategy,
	'header'
) {
	constructor() {
  	super({
  		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  		ignoreExpiration: false,
  		secretOrKey: config.auth.jwt.user.secret,
  	});
	}

	validate(payload: JwtPayload) {
  	return payload;
	}
}
