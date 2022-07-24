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
import { checkEnv, } from '../helper/checkEnv';

export default <ServerRoute[]>[
	{
		method: 'POST',
		path: '/auth/token/generate/{tokenType}',
		handler: api.tokenGenerate,
		options: {
			auth: false,
			pre: [checkEnv],
			id: 'auth.token.generate',
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
		path: '/auth/token/info/{tokenType}',
		handler: api.tokenInfo,
		options: {
			auth: false,
			pre: [checkEnv],
			id: 'auth.token.info',
			description: 'Use this endpoint to decode token',
			tags: ['api', 'auth', 'token'],
			validate: {
				params: tokenTypeSchema,
			},
			response: {
				schema: outputOkSchema(Joi.object()),
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
	}
];
