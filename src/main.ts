import * as Hapi from '@hapi/hapi';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import * as Pino from 'hapi-pino';
import * as HapiBearer from 'hapi-auth-bearer-token';
import * as HapiPulse from 'hapi-pulse';
import * as HapiSwagger from 'hapi-swagger';
import Qs from 'qs';
import routes from './server/routes';
import { config, } from './server/config/config';
import loadSwaggerConfig from './server/config/swagger';
import pinoConfig from './server/config/pino';
import {
	handleValidationError,
	responseHandler,
	Strategies,
	Token,
	tokenValidate,
} from './server/utils';
import { initDatabase, } from './server/models';

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
		options: loadSwaggerConfig,
	});
	await server.register({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		plugin: HapiPulse,
		options: {
			timeout: 15000,
			signals: ['SIGINT'],
		},
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

	config.db = await initDatabase({});

	// Error handler
	server.ext('onPreResponse', responseHandler);

	// Запускаем сервер
	try {
		await server.start();
		server.log('info', `Server running at: ${server.info.uri}`);
		server.log('info', 'Node.js version ' + process.versions.node);
	} catch (err) {
		server.log('error', JSON.stringify(err));
	}

	return server;
}

try {
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	if (!config.test) init();
} catch (err) {
	console.error(err);
}
