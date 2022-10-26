import { describe, beforeAll, it, expect } from '@jest/globals';
import { Server } from '@hapi/hapi';
import { ConfirmationProviderPlugin } from '../src/server/confirmation-provider';
import { ConfirmationProviderList } from '../src/server/confirmation-provider/confirmation-provider.enum';

describe('Confirmation service', () => {
	const server = new Server();
	const to = '+79138779782';
	let res: boolean;

	beforeAll(async () => {
		await server.register({
			plugin: ConfirmationProviderPlugin,
		});
	});

	it('send', async () => {
		res = await server.confirmationProviderSend(ConfirmationProviderList.TEST, {
			to,
			code: '123456',
		});
		expect(res).toBe(true);
	});
});
