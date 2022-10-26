import { AbstractProvider, } from './abstract-provider';
import { ConfirmationSendData, } from './confirmation-provider.interfaces';

export class TestProvider extends AbstractProvider {
	handler(confirmation: ConfirmationSendData): boolean {
		console.log('[ConfirmationProvider:Test]', confirmation);
		return true;
	}
}
