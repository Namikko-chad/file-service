import { config as dotenv, } from 'dotenv';
import * as path from 'path';
import { Sequelize, } from 'sequelize-typescript';

dotenv();

function configLoad() {
	return {
		auth: {
			jwt: {
				file: {
					secret: process.env.FA_SECRET,
					lifetime: Number(process.env.FA_LIFETIME),
				},
				user: {
					secret: process.env.UA_SECRET,
					lifetime: Number(process.env.UA_LIFETIME),
				},
				admin: {
					secret: process.env.AA_SECRET,
					lifetime: Number(process.env.AA_LIFETIME),
				},
			},
		},
		cors: {
			origin: process.env.CORS_ORIGIN
				? (JSON.parse(process.env.CORS_ORIGIN) as string[])
				: ['*'],
			maxAge: process.env.CORS_MAX_AGE ? Number(process.env.CORS_MAX_AGE) : 600,
			headers: process.env.CORS_HEADERS
				? (JSON.parse(process.env.CORS_HEADERS) as string[])
				: ['Accept', 'Content-Type', 'Authorization'],
			credentials: process.env.CORS_ALLOW_CREDENTIALS === 'true' ? true : false,
			exposedHeaders: process.env.CORS_EXPOSE_HEADERS
				? (JSON.parse(process.env.CORS_EXPOSE_HEADERS) as string[])
				: ['Content-Type', 'Content-length', 'Content-Disposition'],
		},
		debug: process.env.DEBUG === 'true' ? true : false,
		development: process.env.NODE_ENV === 'development' ? true : false,
		db: <Sequelize>{},
		dbLink: process.env.DATABASE_LINK as string,
		files: {
			allowedExtensionsRegExp:
        /(jpg|jpeg|png|gif|html|webp|pdf|doc|docx|rtf|xls|xlsx|sig|svg)$/,
			allowedExtensions: process.env.FILETYPE
				? process.env.FILETYPE
				: 'jpg|jpeg|png|gif|html|webp|pdf|doc|docx|rtf|xls|xlsx|sig|svg',
			maxRequestSize: 1024 * 1024 * 30,
			filesDir: path.join(__dirname, '..', '..', '..', 'assets/'),
		},
		server: {
			port: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000,
			host: process.env.SERVER_HOST ? process.env.SERVER_HOST : 'localhost',
			shutdownTimeout: process.env.SERVER_SHUTDOWN_TIMEOUT
				? Number(process.env.SERVER_SHUTDOWN_TIMEOUT)
				: 15000,
		},
		test: process.env.NODE_ENV === 'test' ? true : false,
	};
}

export const config = configLoad();
