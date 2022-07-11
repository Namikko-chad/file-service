import { ServerRoute, } from '@hapi/hapi';
import Joi from 'joi';
import {
	tokenSchema,
	guidSchema,
	tokenTypeSchema,
	outputOkSchema,
	outputEmptySchema,
} from '../schemas';
import * as api from '../api/auth';
import { checkDevelop, } from '../helper/checkAccess';

export default <ServerRoute[]>[
	{
		method: 'POST',
		path: '/auth/token/generate/{tokenType}',
		handler: api.tokenGenerate,
		options: {
			auth: false,
			id: 'auth.token.generate',
			pre: [checkDevelop],
			description: 'Generate token for authorization',
			tags: ['api', 'auth', 'token'],
			validate: {
				params: tokenTypeSchema,
				payload: Joi.object({
					userId: guidSchema.required(),
					fileId: guidSchema.optional(),
				}),
			},
			response: {
				schema: outputOkSchema(tokenSchema),
			},
		},
	},
	{
		method: 'GET',
		path: '/auth/token/validate/{tokenType}',
		handler: api.tokenValidate,
		options: {
			id: 'auth.token.validate',
			description: 'Use this endpoint to validate token',
			tags: ['api', 'auth', 'token'],
			validate: {
				params: tokenTypeSchema,
			},
			response: {
				schema: outputEmptySchema(),
			},
		},
	},
	{
		method: 'GET',
		path: '/auth/token/info/{tokenType}',
		handler: api.tokenInfo,
		options: {
			auth: false,
			id: 'auth.token.info',
			pre: [checkDevelop],
			description: 'Use this endpoint to decode token',
			tags: ['api', 'auth', 'token'],
			validate: {
				params: tokenTypeSchema,
			},
			response: {
				schema: outputOkSchema(Joi.object()),
			},
		},
	}
];
