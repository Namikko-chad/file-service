/* eslint-disable */
import { Boom } from '@hapi/boom';
import { error } from './index';
import { Errors } from '../enum/errors';
import { Exception } from './Exception';

export function handlerError(msg: string, err: Exception | Boom | any | undefined): Boom {
  switch (err.constructor.name) {
    case 'Exception':
      return error(err.code, err.msg, err.data);
    case 'Boom':
      return err;
    default:
      console.error(msg, err);
      return error(Errors.InternalServerError, msg, {});
  }
}
