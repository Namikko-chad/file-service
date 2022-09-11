import { Request, } from '@hapi/hapi';
import { Boom, } from '@hapi/boom';
import { sign, } from 'jsonwebtoken';
import { config, } from '../config/config';
import { IOutputEmpty, IOutputOk, } from '../interfaces';
import {
	decodeJwt,
	Token,
	Exception,
	handlerError,
	outputEmpty,
	outputOk,
} from '../utils';
import { Errors, ErrorsMessages, } from '../enum';

export function tokenGenerate(r: Request): IOutputOk<{ token: string }> | Boom {
	/* eslint-disable security/detect-object-injection */
	try {
		const { userId, fileId, } = r.payload as { userId: string; fileId?: string };
		const tokenType = r.params['tokenType'] as Token;
		const token = sign(
			{ userId, fileId, timestamp: Date.now(), },
      config.auth.jwt[tokenType].secret as string,
      { expiresIn: config.auth.jwt[tokenType].lifetime, }
		);

		return outputOk({ token, });
	} catch (err) {
		return handlerError('Failed to generate token', err);
	}
}

export function tokenInfo(
	r: Request
): IOutputOk<Record<string, unknown>> | Boom {
	/* eslint-disable security/detect-object-injection */
	try {
		const tokenType = r.params['tokenType'] as Token;
		if (!r.headers['authorization'])
			throw new Exception(
				Errors.InvalidPayload,
				ErrorsMessages[Errors.InvalidPayload]
			);
		const data = decodeJwt(
			r.headers['authorization'].slice(7),
      config.auth.jwt[tokenType].secret as string
		);

		return outputOk({ data, });
	} catch (err) {
		return handlerError('Failed to decode token', err);
	}
}

export function tokenValidate(): IOutputEmpty | Boom {
	try {
		return outputEmpty();
	} catch (err) {
		return handlerError('Failed to validate token', err);
	}
}
