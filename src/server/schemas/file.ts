import Joi from 'joi';
import { IFileResponse, } from '../interfaces';
import { guidSchema, } from './common';

export const fileCreatePayloadSchema = Joi.object({
	file: Joi.any().required(),
}).label('Input file upload');

export const fileEditPayloadSchema = Joi.object({
	public: Joi.bool().default(false).example(false),
	name: Joi.string().example('photo.png'),
}).label('Input file upload');

export const fileSchemaResponse = Joi.object<IFileResponse>({
	id: guidSchema,
	name: Joi.string().example('photo.png'),
	ext: Joi.string().example('png'),
	mime: Joi.string().example('image/png'),
	public: Joi.bool().example(false),
}).label('File upload response');
