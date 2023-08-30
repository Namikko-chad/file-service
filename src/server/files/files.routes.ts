import Joi from 'joi';

import { ServerRoute, } from '@hapi/hapi';

import { Strategies, } from '../auth';
import {
  guidSchema,
  listSchema,
  outputEmptySchema,
  outputOkSchema,
  tokenSchema,
} from '../schemas';
import * as api from './files.api';
import { filesConfig, } from './files.config';
import { 
  fileCreatePayloadSchema,
  fileEditPayloadSchema,
  fileSchemaResponse,
} from './files.schemas';

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
      description: 'Use this endpoint to upload file',
      notes: `Maximum size for the whole request is ${filesConfig.files.maxSize / 1024 / 1024} Mb.
			Allowed extensions are: ${filesConfig.files.allowedExtensions.split('|').toString()}`,
      tags: ['api', 'file'],
      payload: {
        maxBytes: filesConfig.files.maxSize,
        output: 'data',
        allow: 'multipart/form-data',
        multipart: {
          output: 'annotated',
        },
        parse: true,
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form',
        },
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
      description: 'Use this endpoint to upload new filename or public status',
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
