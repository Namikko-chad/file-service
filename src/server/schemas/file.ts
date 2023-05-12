import Joi from 'joi';

import { IFileResponse, } from '../interfaces';
import { guidSchema, } from './common';

export const fileCreatePayloadSchema = Joi.object({
  file: Joi.any().meta({ swaggerType: 'file', }).description('file'),
});

export const fileEditPayloadSchema = Joi.object({
  public: Joi.bool().default(false).example(false),
  name: Joi.string().example('photo.png'),
}).label('Input file edit');

export const fileSchemaResponse = Joi.object<IFileResponse>({
  id: guidSchema,
  name: Joi.string().example('photo.png'),
  ext: Joi.string().example('png'),
  mime: Joi.string().example('image/png'),
  size: Joi.number().example(92022),
  public: Joi.bool().example(false),
}).label('File upload response');
