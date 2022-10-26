import * as Hapi from '@hapi/hapi';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import * as Pino from 'hapi-pino';
import * as HapiBearer from 'hapi-auth-bearer-token';
import * as HapiPulse from 'hapi-pulse';
import * as HapiSwagger from 'hapi-swagger';
import Qs from 'qs';
import routes from './server/routes';
import { config, swaggerConfig, pinoConfig, } from './server/config';
import { Database, loadDatabaseConfig, } from './server/db';
import { SchedulerPlugin, } from './server/scheduler';
import { StoragePlugin, } from './server/storages';
import {
	handleValidationError,
	responseHandler,
	Strategies,
	Token,
	tokenValidate,
} from './server/utils';

declare module '@hapi/hapi' {
	interface UserCredentials {
		id: string;
	}
	interface AuthCredentials {
		fileId: string | undefined;
	}
	interface AuthArtifacts {
		token: string;
		tokenType: Token;
	}
}

export async function init(): Promise<Hapi.Server> {
	const server = new Hapi.Server({
		port: config.server.port,
		host: config.server.host,
		query: {
			parser: (query) => Qs.parse(query),
		},
		routes: {
			cors: config.cors,
			validate: {
				options: {
					// Handle all validation errors
					abortEarly: false,
				},
				failAction: handleValidationError,
			},
			response: {
				failAction: 'log',
			},
		},
	});
	server.realm.modifiers.route.prefix = '/api';
	// Регистрируем расширения
	await server.register([Inert, Vision, HapiBearer]);
	await server.register({
		plugin: Pino,
		options: pinoConfig(true),
	});
	await server.register({
		plugin: HapiSwagger,
		options: swaggerConfig,
	});
	await server.register({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		plugin: HapiPulse,
		options: {
			timeout: 15000,
			signals: ['SIGINT'],
		},
	});
	await server.register({
		plugin: Database,
		options: loadDatabaseConfig(),
	});
	await server.register({
		plugin: StoragePlugin,
	});
	await server.register({
		plugin: SchedulerPlugin,
	});
	// JWT Auth
	server.auth.strategy(Strategies.Header, 'bearer-access-token', {
		validate: tokenValidate,
	});
	server.auth.strategy(Strategies.Query, 'bearer-access-token', {
		allowQueryToken: true,
		validate: tokenValidate,
	});
	server.auth.default(Strategies.Header);
	// Load routes
	server.route(routes);

	// Error handler
	server.ext('onPreResponse', responseHandler);

	// Запускаем сервер
	try {
		server.app.scheduler.init();
		await server.start();
		server.log('info', `Server running at: ${server.info.uri}`);
		server.log('info', 'Node.js version ' + process.versions.node);
	} catch (err) {
		server.log('error', JSON.stringify(err));
	}

	return server;
}

init().catch((error) => console.log(error));
