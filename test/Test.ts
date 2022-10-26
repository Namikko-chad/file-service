import { Server, ServerInjectOptions, ServerRoute } from '@hapi/hapi';
import HapiBearer from 'hapi-auth-bearer-token';
import HapiPino from 'hapi-pino';
import Qs from 'qs';
import FormData from 'form-data';
import { URLSearchParams } from 'url';
import {
	handleValidationError,
	responseHandler,
	Strategies,
	tokenValidate,
} from '../src/server/utils';
import { config, pinoConfig } from '../src/server/config';
import { Database, loadDatabaseConfig } from '../src/server/db';
import { StoragePlugin } from '../src/server/storages';

type IQuery = Record<string, string>;
type IPayload = Record<string, unknown> | FormData;

export class Test {
	public server: Server = new Server();
	private token?: string;

	private async init(routes?: ServerRoute[] | ServerRoute): Promise<Server> {
		const server = new Server({
			query: {
				parser: (query) => Qs.parse(query),
			},
			routes: {
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
		await server.register(HapiBearer);
		await server.register({
			plugin: Database,
			options: loadDatabaseConfig(),
		});
		await server.register({
			plugin: StoragePlugin,
		});
		if (process.env['DEBUG'] === 'true') {
			await server.register({
				plugin: HapiPino,
				options: pinoConfig(false),
			});
		}

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
		if (routes) server.route(routes);

		// Error handler
		server.ext('onPreResponse', responseHandler);

		return server;
	}

	private sendRequest(method: string, path: string, query?: IQuery, payload?: IPayload) {
		let queryString = '';
		if (query) {
			queryString = '?' + new URLSearchParams(query).toString();
		}
		payload;
		const options: ServerInjectOptions = {
			method,
			url: path + queryString,
			payload: payload instanceof FormData ? payload.getBuffer() : payload,
			headers: this.token
				? {
						authorization: `Bearer ${this.token}`,
				  }
				: undefined,
		};
		if (payload instanceof FormData)
			// @ts-ignore
			options.headers = Object.assign(options.headers, payload.getHeaders());
		return this.server.inject(options);
	}

	public $get(_path: string, _query?: IQuery) {
		return this.sendRequest('GET', _path, _query);
	}

	public $post(_path: string, _query?: IQuery, _payload?: IPayload) {
		return this.sendRequest('POST', _path, _query, _payload);
	}

	public $put(_path: string, _query?: IQuery, _payload?: IPayload) {
		return this.sendRequest('PUT', _path, _query, _payload);
	}

	public $delete(_path: string, _query?: IQuery, _payload?: IPayload) {
		return this.sendRequest('DELETE', _path, _query, _payload);
	}

	public authenticate(_token: string) {
		this.token = _token;
	}

	public logout() {
		this.token = undefined;
	}

	public async start(routes?: ServerRoute[] | ServerRoute): Promise<this> {
		this.server = await this.init(routes);
		return this;
	}

	public async stop(): Promise<void> {
		await this.server.app.db.close();
		await this.server.stop({ timeout: 100 });
		return;
	}

	public async reset() {
		await config.db.truncate({ cascade: true });
	}
}
