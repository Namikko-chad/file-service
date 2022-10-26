import { ConfirmationProviderList, } from './confirmation-provider.enum';

export interface ConfirmationProviderServerAddon {
  confirmationProviderSend(
    _provider: ConfirmationProviderList,
    _data: ConfirmationSendData
  ): Promise<boolean>;
}

export interface ConfirmationSendData {
  code: string;
  to: string;
}
