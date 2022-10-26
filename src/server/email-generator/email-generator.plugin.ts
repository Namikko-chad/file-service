import { Plugin, Server, } from '@hapi/hapi';
import { EmailType, } from './email-generator.enum';
import { EmailGeneratorHandler, } from './email-generator.handler';
import { EmailStub, FieldsEmailRequest, Templates, } from './email-generator.interfaces';

declare module '@hapi/hapi' {
	export interface Server {
		generateEmail<T extends EmailType>(key: EmailType, fields: FieldsEmailRequest[T]): EmailStub;
	}
}

export const EmailGeneratorPlugin: Plugin<never> = {
	name: 'email-generator',
	register(server: Server): void {
		const handler = new EmailGeneratorHandler(Templates);
		server.decorate('server', 'generateEmail', handler.buildTemplate.bind(handler));
	},
};
