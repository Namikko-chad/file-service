import { Boom, } from '@hapi/boom';
import { AuthArtifacts, AuthCredentials, Request, } from '@hapi/hapi';
import * as jwt from 'jsonwebtoken';
import { config, } from '../config/config';
import { Errors, ErrorsMessages, } from '../enum/errors';
import { error, } from './index';

export enum Token {
  File = 'file',
  User = 'user',
  Admin = 'admin',
}

export enum Strategies {
  Header = 'header',
  Query = 'query',
}

export interface IJwtData {
  userId: string;
  fileId?: string;
  timestamp: number;
}

export function decodeJwt(token: string, secret: string): IJwtData {
	return jwt.verify(token, secret) as IJwtData;
}

interface TokenValidateSuccess {
  isValid: boolean;
  credentials: AuthCredentials;
  artifacts: AuthArtifacts;
}

export function tokenValidate(
	r: Request,
	token: string
): TokenValidateSuccess | Boom {
	r;
	let data: IJwtData;
	let tokenType = Token.User;
	Object.values(Token)
		.map((tokenType) => {
			return {
				tokenType,
				// eslint-disable-next-line security/detect-object-injection
				secret: (config.auth.jwt[tokenType] as { secret: string }).secret,
			};
		})
		.forEach((secret) => {
			try {
				data = decodeJwt(token, secret.secret);
				tokenType = secret.tokenType;
			} catch (err) {
				const e = err as Error;
				if (e.name === 'TokenExpiredError')
					throw error(
						Errors.TokenExpired,
						ErrorsMessages[Errors.TokenExpired],
						{}
					);
			}
		});
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (!data)
		throw error(Errors.TokenInvalid, ErrorsMessages[Errors.TokenInvalid], {});
	return {
		isValid: true,
		credentials: { user: { id: data.userId, }, fileId: data?.fileId, },
		artifacts: { token, tokenType, },
	};
}
