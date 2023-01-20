import { EmailType, } from '../email-generator/email-generator.enum';
import { FieldsEmailRequest, } from '../email-generator/email-generator.interfaces';

export interface EmailSenderOptions {
	readonly smtpTransport: {
		readonly host: string;
		readonly port: string;
		readonly secure: boolean;
		readonly auth: {
			readonly user: string;
			readonly pass: string;
		};
	};
	readonly sender: string;
}

export interface EmailData {
	readonly from: string;
	readonly to: string;
	readonly subject: string;
	readonly html: string;
}

export interface SendEmailRequest<T extends EmailType> {
	readonly to: string;
	readonly type: T;
	readonly fields: FieldsEmailRequest[T];
}
