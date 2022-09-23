import { ServerRoute, } from '@hapi/hapi';
import Joi from 'joi';
import * as api from '../api/file';
import { config, } from '../config/config';
import {
	tokenSchema,
	fileCreatePayloadSchema,
	fileEditPayloadSchema,
	fileSchemaResponse,
	guidSchema,
	listSchema,
	outputEmptySchema,
	outputOkSchema,
} from '../schemas';
import { Strategies, } from '../utils';

export default <ServerRoute[]>[
	{
		method: 'GET',
		path: '/files',
		handler: api.list,
		options: {
			id: 'files.list',
			description: 'Use this endpoint to list file',
			tags: ['api', 'file'],
			validate: {
				query: listSchema,
			},
		},
	},
	{
		method: 'POST',
		path: '/files',
		handler: api.create,
		options: {
			id: 'files.create',
			description: 'This method allows to upload file',
			notes: `Maximum size for the whole request is ${
				config.files.maxSize / 1024 / 1024
			} Mb.
			Allowed extensions are: ${config.files.allowedExtensions
				.split('|')
				.toString()}`,
			tags: ['api', 'file'],
			payload: {
				maxBytes: config.files.maxSize,
				output: 'data',
				allow: 'multipart/form-data',
				multipart: {
					output: 'annotated',
				},
				parse: true,
			},
			validate: {
				payload: fileCreatePayloadSchema,
			},
			response: {
				schema: outputOkSchema(fileSchemaResponse).label('Output file upload'),
			},
		},
	},
	{
		method: 'GET',
		path: '/files/{fileId}',
		handler: api.retrieve,
		options: {
			auth: { strategies: [Strategies.Header, Strategies.Query], mode: 'try', },
			id: 'files.retrieve',
			description: 'Use this endpoint to get file',
			tags: ['api', 'file'],
			validate: {
				params: Joi.object({
					fileId: guidSchema.required().label('File id'),
				}),
				query: Joi.object({
					access_token: tokenSchema.optional(),
				}),
			},
		},
	},
	{
		method: 'PUT',
		path: '/files/{fileId}',
		handler: api.edit,
		options: {
			id: 'files.edit',
			description: 'This method allows to upload new filename or public status',
			tags: ['api', 'file'],
			validate: {
				params: Joi.object({
					fileId: guidSchema.required().label('File id'),
				}),
				payload: fileEditPayloadSchema,
			},
			response: {
				schema: outputOkSchema(fileSchemaResponse).label('Output file upload'),
			},
		},
	},
	{
		method: 'DELETE',
		path: '/files/{fileId}',
		handler: api.destroy,
		options: {
			id: 'files.delete',
			description: 'Use this endpoint to delete file',
			tags: ['api', 'file'],
			validate: {
				params: Joi.object({
					fileId: guidSchema.required().label('File id'),
				}),
			},
			response: {
				schema: outputEmptySchema(),
			},
		},
	},
	{
		method: 'GET',
		path: '/files/{fileId}/info',
		handler: api.info,
		options: {
			auth: { strategies: [Strategies.Header, Strategies.Query], mode: 'try', },
			id: 'files.info',
			description: 'Use this endpoint to get information about file',
			tags: ['api', 'file'],
			validate: {
				params: Joi.object({
					fileId: guidSchema.required().label('File id'),
				}),
			},
			response: {
				schema: outputOkSchema(fileSchemaResponse).label('Output file upload'),
			},
		},
	}
];
