import { Boom, } from '@hapi/boom';
import { config, } from '../config/config';
import { Exception, handlerError, } from '../utils';
import { Errors, ErrorsMessages, } from '../enum';

export function checkDevelop(): boolean | Boom {
	try {
		if (!config.development)
			throw new Exception(Errors.Forbidden, ErrorsMessages[Errors.Forbidden]);
	} catch (error) {
		return handlerError('Only for development area', error);
	}
	return true;
}
