import * as os from 'os';
import { config, } from 'dotenv';

config();

export default {
	auth: {
		jwt: {
			file: {
				secret: process.env['FA_SECRET'],
				lifetime: Number(process.env['FA_LIFETIME']),
			},
			user: {
				secret: process.env['UA_SECRET'],
				lifetime: Number(process.env['UA_LIFETIME']),
			},
			admin: {
				secret: process.env['AA_SECRET'],
				lifetime: Number(process.env['AA_LIFETIME']),
			},
		},
	},
	env: process.env['NODE_ENV'] as
    | 'development'
    | 'stage'
    | 'test'
    | 'production',
	files: {
		allowedExtensions:
      process.env['FILETYPE'] ??
      'jpg|jpeg|png|gif|html|webp|pdf|docx|rtf|xls|xlsx|sig|svg|iso',
		allowedExtensionsRegExp: RegExp(
			`(${
				process.env['FILETYPE'] ??
        'jpg|jpeg|png|gif|html|webp|pdf|docx|rtf|xls|xlsx|sig|svg|iso'
			})$`
		),
		bufferSize: 1024 * 1024 * 1,
		bufferStorage: process.env['STORAGE_TEMP'] ?? os.tmpdir() + '/',
		capacityPerUser: 1024 * 1024 * 100,
		filesDir: 'assert',
		maxSize: 1024 * 1024 * 30 * 30000,
	},
	debug: process.env['DEBUG'] === 'true',
	development: process.env['NODE_ENV'] === 'development',
	stage: process.env['NODE_ENV'] === 'stage',
	production: process.env['NODE_ENV'] === 'production',
	test: process.env['NODE_ENV'] === 'test',
	server: {
		base_url: process.env['BASE_URL'],
		route_prefix: process.env['ROUTE_PREFIX'],
		port: process.env['SERVER_PORT']
			? Number(process.env['SERVER_PORT'])
			: 3050,
		cors: {
			origin: '*',
			methods: ['GET', 'POST', 'PUT', 'DELETE'],
		},
	},
	swagger: {
		prefix: process.env['SWAGGER_PREFIX'],
	},
};
