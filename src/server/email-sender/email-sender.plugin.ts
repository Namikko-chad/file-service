import { Plugin, Server, } from '@hapi/hapi';
import { EmailType } from 'server/email-generator';
import { EmailSenderHandler, } from './email-sender.handler';
import { EmailSenderOptions, SendEmailRequest, } from './email-sender.settings';

declare module '@hapi/hapi' {
	export interface Server {
		sendEmail<T extends EmailType>(_email: SendEmailRequest<T>): Promise<void>;
	}
}

export const EmailSenderPlugin: Plugin<EmailSenderOptions> = {
	name: 'email-sender',
	register(server: Server, options: EmailSenderOptions): void {
		const handler = new EmailSenderHandler(server, options);
		server.decorate('server', 'sendEmail', handler.send.bind(handler));
	},
	dependencies: ['email-generator'],
};
