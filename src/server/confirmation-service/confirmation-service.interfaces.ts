import { GenerateOptions, } from 'generate-password';

import { ConfirmationProviderList, } from '../confirmation-provider/confirmation-provider.enum';
import { Exception, } from '../utils';
import { ConfirmationStatus, } from './confirmation-service.enum';

export interface ConfirmationServiceServerAddon {
  confirmationCreate(_to: string, _provider?: ConfirmationProviderList): ConfirmationData;
  confirmationSend(_data: ConfirmationData): Promise<ConfirmationData>;
  confirmationVerify(_data: ConfirmationData, _code: string): ConfirmationData;
}

export interface ConfirmationData {
  id: string;
  provider: ConfirmationProviderList;
  to: string;
  code?: string;
  error?: Exception | null;
  counter: number;
  createdAt: number;
  sentAt?: number;
  expires?: number;
  confirmed: boolean;
  confirmedAt?: number;
  status: ConfirmationStatus;
  test?: string;
}

export interface ConfirmationSendData {
  code: string;
  to: string;
}
export interface ConfirmationProviderDefaultsInterface {
  count: number;
  generator: GenerateOptions;
  lifetime: number; // Количество времени для блокировки в миллисекундах
}
