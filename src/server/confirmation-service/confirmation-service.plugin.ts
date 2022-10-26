import { Plugin, Server, } from '@hapi/hapi';
import { ConfirmationServiceHandler, } from './confirmation-service.handler';
import { ConfirmationServiceServerAddon, } from './confirmation-service.interfaces';

declare module '@hapi/hapi' {
	// eslint-disable-next-line
	export interface Server extends ConfirmationServiceServerAddon {}
}

export const ConfirmationServicePlugin: Plugin<unknown> = {
	name: 'confirmation-service',
	register(server: Server): void {
		const confirmation = new ConfirmationServiceHandler(server);
		server.decorate('server', 'confirmationCreate', confirmation.create.bind(confirmation));
		server.decorate('server', 'confirmationSend', confirmation.send.bind(confirmation));
		server.decorate('server', 'confirmationVerify', confirmation.verify.bind(confirmation));
	},
};
