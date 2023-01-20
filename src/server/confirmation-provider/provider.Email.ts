import { EmailType, } from '../email-generator';
import { SendEmailRequest, } from '../email-sender';
import { AbstractProvider, } from './abstract-provider';
import { ConfirmationSendData, } from './confirmation-provider.interfaces';

export class EmailProvider extends AbstractProvider {
	async handler(confirmation: ConfirmationSendData): Promise<boolean> {
		const { to, code, } = confirmation;
		const emailMessage: SendEmailRequest<EmailType.Confirmation> = {
			to,
			type: EmailType.Confirmation,
			fields: {
				code,
			},
		};
		await this.server.sendEmail(emailMessage);
		return true;
	}
}
