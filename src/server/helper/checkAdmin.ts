import { Request, } from '@hapi/hapi';
import { Boom, } from '@hapi/boom';
import { Exception, handlerError, Token, } from '../utils';
import { Errors, ErrorsMessages, } from '../enum';

export function checkAdmin(r: Request): boolean | Boom {
	try {
		if (r.auth.artifacts.tokenType !== Token.Admin)
			throw new Exception(Errors.Forbidden, ErrorsMessages[Errors.Forbidden]);
		return true;
	} catch (error) {
		return handlerError('Only for development area', error);
	}
}
