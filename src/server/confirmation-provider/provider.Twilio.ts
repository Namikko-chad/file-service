// import { TwilioPlugin, loadTwilioConfig, } from 'twilio-plugin';
// import { AbstractProvider, } from './abstract-provider';

// export class TwilioProvider extends AbstractProvider {
// 	async init(): Promise<this> {
// 		await this._server.register({
// 			plugin: TwilioPlugin,
// 			options: loadTwilioConfig(),
// 		});
// 		return this;
// 	}

// 	async handler(confirmation: { code: string; to: string }): Promise<boolean> {
// 		await this._server.twilioSendSMS(`Ваш код подтверждения ${confirmation.code}`, confirmation.to);
// 		return true;
// 	}
// }
