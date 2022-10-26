import { describe, beforeAll, it, expect } from '@jest/globals';
import { Server } from '@hapi/hapi';
import { EmailGeneratorPlugin, EmailType, Templates } from '../src/server/email-generator';

describe('EmailGenerator', () => {
	const server = new Server();

	beforeAll(async () => {
		await server.register({
			plugin: EmailGeneratorPlugin,
		});
	});

	it('generate', () => {
		const email = server.generateEmail(EmailType.Test, { code: '123456' });
		expect(email.subject).toBe(Templates.test.subject);
		expect(email.body).toContain('123456');
	});
});
