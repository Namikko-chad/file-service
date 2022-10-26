import { Plugin, Server, } from '@hapi/hapi';
import { ConfirmationProviderHandler, } from './confirmation-provider.handler';
import { ConfirmationProviderServerAddon, } from './confirmation-provider.interfaces';
import { ConfirmationProviderList, } from './confirmation-provider.enum';
import { EmailProvider, } from './provider.Email';
import { TestProvider, } from './provider.Test';
// import { NewTelProvider, } from './provider.Newtel';
// import { TwilioProvider, } from './provider.Twilio';

declare module '@hapi/hapi' {
  // eslint-disable-next-line
  export interface Server extends ConfirmationProviderServerAddon {}
}

export const ConfirmationProviderPlugin: Plugin<unknown> = {
	name: 'confirmation-provider',
	register(server: Server): void {
		const confirmation = new ConfirmationProviderHandler();
		// confirmation.registerProvider(
		// 	ConfirmationProviderList.TWILIO,
		// 	await new TwilioProvider(server).init()
		// );
		// confirmation.registerProvider(
		// 	ConfirmationProviderList.NEWTEL,
		// 	await new NewTelProvider(server).init()
		// );
		confirmation.registerProvider(
			ConfirmationProviderList.EMAIL,
			new EmailProvider(server)
		);
		confirmation.registerProvider(
			ConfirmationProviderList.TEST,
			new TestProvider(server)
		);
		server.decorate(
			'server',
			'confirmationProviderSend',
			confirmation.send.bind(confirmation)
		);
	},
	dependencies: ['email-generator', 'email-sender', 'confirmation-service'],
};
