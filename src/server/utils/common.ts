import { v4 as uuidv4, } from 'uuid';
import { Request, ResponseObject, ResponseToolkit, } from '@hapi/hapi';
import { Boom, } from '@hapi/boom';
import { ValidationError, } from 'joi';
import {
	IOutputEmpty,
	IOutputOk,
	IOutputPagination,
	IBoomData,
} from '../interfaces';

export function getUUID(): string {
	return uuidv4();
}

export function outputEmpty(): IOutputEmpty {
	return {
		ok: true,
	};
}

export function outputOk<R>(result: R): IOutputOk<R> {
	return {
		ok: true,
		result,
	};
}

export function outputPagination<R>(
	count: number[] | number,
	rows: R
): IOutputPagination<R> {
	return {
		ok: true,
		result: {
			count,
			rows,
		},
	};
}

export function error<T>(
	code: number,
	msg: string,
	data: T
): Boom<IBoomData<T>> {
	return new Boom(msg, {
		data: {
			code,
			data,
			api: true,
		},
		statusCode: Math.floor(code / 1000),
	});
}

export function responseHandler(
	r: Request,
	h: ResponseToolkit
): ResponseObject | symbol {
	/* eslint-disable */
  const response = r.response as Boom;

  // Handle default hapi errors (like not found, etc.)
  if (response.isBoom && response.data === null) {
    r.response = h
      .response({
        ok: false,
        code: Math.floor(response.output.statusCode * 1000),
        data: {},
        msg: response.message,
      })
      .code(response.output.statusCode);
    return r.response;
  }

  // Handle custom api error
  if (response.isBoom && response.data.api) {
    r.response = h
      .response({
        ok: false,
        code: response.data.code,
        data: response.data.data,
        msg: response.output.payload.message,
      })
      .code(Math.floor(response.data.code / 1000));
    return r.response;
  }

  // Handle non api errors with data
  if (response.isBoom && !response.data.api) {
    r.response = h
      .response({
        ok: false,
        code: Math.floor(response.output.statusCode * 1000),
        data: response.data,
        msg: response.message,
      })
      .code(response.output.statusCode);
    return r.response;
  }

  return h.continue;
}

export function handleValidationError(
  request: Request,
  h: ResponseToolkit,
  err: Error | undefined
): Boom {
  request;
  h;
  const errors = err as ValidationError;
  return error(
    400000,
    "Validation error",
    errors.details.map((e) => ({
      field: e.context?.key,
      reason: e.type.replace("any.", ""),
    }))
  );
}
