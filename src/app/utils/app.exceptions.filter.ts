import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, } from '@nestjs/common';

import { HttpAdapterHost, } from '@nestjs/core';
import { Exception, } from './Exception';

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
	private readonly _adapter: HttpAdapterHost;

	constructor(adapter: HttpAdapterHost) {
		this._adapter = adapter;
	}

	catch(exception: unknown, host: ArgumentsHost): void {
		const { httpAdapter, } = this._adapter;
		const ctx = host.switchToHttp();

		const httpStatus =
			exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const message =	exception instanceof HttpException ? exception.getResponse() : 'Internal server Error';
		if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
			console.log(exception);
		}
		const responseBody = {
			ok: false,
			code: httpStatus,
			data: exception instanceof Exception ? exception.data : {},
			message: typeof message === 'string' ? 
				message : 
				Array.isArray((message as { message: string | string[] }).message) ? 
					(message as { message: string[] }).message.join(', ') : 
					(message as { message: string }).message,
		};

		httpAdapter.reply(
			ctx.getResponse(),
			responseBody,
			httpStatus > 1000 ? Math.floor(httpStatus / 1000) : httpStatus
		);
	}
}
