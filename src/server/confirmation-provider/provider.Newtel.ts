// import { NewTelPlugin, loadNewTelConfig, } from 'newtel-plugin';
// import { AbstractProvider, } from './abstract-provider';

// export class NewTelProvider extends AbstractProvider {
// 	async init(): Promise<this> {
// 		await this._server.register({
// 			plugin: NewTelPlugin,
// 			options: loadNewTelConfig(),
// 		});
// 		return this;
// 	}

// 	async handler(confirmation: { code: string; to: string }): Promise<boolean> {
// 		const options = {
// 			dstNumber: confirmation.to.replace(/[^0-9]/g, ''),
// 			pin: confirmation.code,
// 			timeout: 20,
// 		};
// 		await this._server.newtelCallPassword('start-password-call', options);
// 		return true;
// 	}
// }
