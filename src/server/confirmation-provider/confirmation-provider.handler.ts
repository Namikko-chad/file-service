import { AbstractProvider, } from './abstract-provider';
import { ConfirmationProviderList, } from './confirmation-provider.enum';
import { ConfirmationSendData, } from './confirmation-provider.interfaces';

export class ConfirmationProviderHandler {
	private providers = new Map<ConfirmationProviderList, AbstractProvider>();

	async send(_provider: ConfirmationProviderList, _data: ConfirmationSendData): Promise<boolean> {
		if (!this.providers.has(_provider)) {
			console.error(_provider);
			throw new ReferenceError('Provider not registered');
		}
		// FIXME remove comments and repair error
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await this.providers.get(_provider).handler(_data);
		return true;
	}

	public registerProvider(provider: ConfirmationProviderList, worker: AbstractProvider): void {
		this.providers.set(provider, worker);
	}
}
