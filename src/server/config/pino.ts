/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as Hapi from '@hapi/hapi';

export function pinoConfig(prettify?: boolean) {
	return {
		prettyPrint: prettify
			? {
				colorize: true,
				crlf: false,
				jsonPretty: false,
				translateTime: 'yyyy-mm-dd HH:MM:ss',
				ignore: 'pid,hostname,v,tags,data',
				messageFormat: '{data}',
				customPrettifiers: {
					response: {
						messageFormat: '{req.url} - {req.method} - code:{req.statusCode}',
					},
				},
			}
			: false,
		serializers: {
			req: function customReqSerializer(req: Hapi.Request) {
				return {
					method: req.method,
					url: req.url,
					payload: req.payload,
				};
			},
			// TODO define res
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			res: function customResSerializer(res: any) {
				return {
					code: res.statusCode,
					payload: res.result,
					data: res.data,
				};
			},
		},
		logPayload: true,
		logEvents: ['response', 'request'],
		logQueryParams: true,
		redact: {
			// Censoring user's credentials, auth-tokens and file's Buffer representation in payload.
			paths: [
				'payload.password',
				'payload.newPassword',
				'payload.oldPassword',
				'req.headers.authorization',
				'payload.file.payload'
			],
			censor: '***',
		},
		timestamp: () => `,"time":"${new Date(Date.now()).toLocaleString()}"`,
	};
}
