import { ConfirmationProviderList, } from '../confirmation-provider/confirmation-provider.enum';
import { ConfirmationProviderDefaultsInterface, } from './confirmation-service.interfaces';

export const ConfirmationProviderDefaults: Record<
  ConfirmationProviderList,
  ConfirmationProviderDefaultsInterface
> = {
	[ConfirmationProviderList.EMAIL]: {
		count: 5,
		generator: {
			length: 12,
			numbers: true,
			symbols: false,
			lowercase: true,
			uppercase: true,
		},
		lifetime: 30 * 60 * 1000,
	},
	[ConfirmationProviderList.NEWTEL]: {
		count: 3,
		generator: {
			length: 4,
			numbers: true,
			symbols: false,
			lowercase: false,
			uppercase: false,
		},
		lifetime: 30 * 60 * 1000,
	},
	[ConfirmationProviderList.TWILIO]: {
		count: 3,
		generator: {
			length: 6,
			numbers: true,
			symbols: false,
			lowercase: false,
			uppercase: false,
		},
		lifetime: 30 * 60 * 1000,
	},
	[ConfirmationProviderList.TOTP]: {
		count: 1,
		generator: {},
		lifetime: 30 * 60 * 1000,
	},
	[ConfirmationProviderList.TEST]: {
		count: 5,
		generator: {},
		lifetime: 30 * 60 * 1000,
	},
};
