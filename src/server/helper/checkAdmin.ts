import { Boom, } from '@hapi/boom';
import { Request, } from '@hapi/hapi';

import { Errors, ErrorsMessages, } from '../enum';
import { Exception, handlerError, Token, } from '../utils';

export function checkAdmin(r: Request): boolean | Boom {
  try {
    if (r.auth.artifacts.tokenType !== Token.Admin) throw new Exception(Errors.Forbidden, ErrorsMessages[Errors.Forbidden]);

    return true;
  } catch (error) {
    return handlerError('Only for development area', error);
  }
}
