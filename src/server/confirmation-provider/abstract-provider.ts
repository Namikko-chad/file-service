import { Server, } from '@hapi/hapi';

import { ConfirmationSendData, } from './confirmation-provider.interfaces';

export abstract class AbstractProvider {
  constructor(protected readonly server: Server) {}

  abstract handler(confirmation: ConfirmationSendData): Promise<boolean> | boolean;
}
