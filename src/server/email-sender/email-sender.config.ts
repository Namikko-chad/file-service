import { config, } from 'dotenv';
import { EmailSenderOptions, } from './email-sender.settings';

let emailSenderConfig: EmailSenderOptions | undefined;

export function loadEmailSenderConfig(): EmailSenderOptions {
	if (!emailSenderConfig) {
		config();
		emailSenderConfig = {
			smtpTransport: {
				host: process.env['SMTP_HOST'] as string,
				port: process.env['SMTP_PORT'] as string,
				secure: false,
				auth: {
					user: process.env['SMTP_USER'] as string,
					pass: process.env['SMTP_PASS'] as string,
				},
			},
			sender: process.env['EMAIL_SENDER'] as string,
		};
	}

	return emailSenderConfig;
}
