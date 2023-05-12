import { Boom, } from '@hapi/boom';

import { config, } from '../config/config';
import { Errors, ErrorsMessages, } from '../enum';
import { Exception, handlerError, } from '../utils';

export function checkEnv(): boolean | Boom {
  try {
    switch (config.env) {
      case 'production':
        throw new Exception(Errors.Forbidden, ErrorsMessages[Errors.Forbidden]);
    }

    return true;
  } catch (error) {
    return handlerError('Only for development environment', error);
  }
}
