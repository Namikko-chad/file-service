import { Server, } from '@hapi/hapi';
import * as nodemailer from 'nodemailer';
import { EmailType, } from '../email-generator/email-generator.enum';
import { EmailStub, } from '../email-generator/email-generator.interfaces';
import { EmailData, EmailSenderOptions, SendEmailRequest, } from './email-sender.settings';

export class EmailSenderHandler {
	_server: Server;
	_transport: nodemailer.Transporter;
	_sender: string;
	protected readonly logPrefix = '[EmailSender:handler]';

	constructor(server: Server, options: EmailSenderOptions) {
		this._server = server;
		this._transport = nodemailer.createTransport(
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			options.smtpTransport /* FIXME wrong SMTP options */
		);
		this._sender = options.sender;
	}

	private _prepareOptions<T extends EmailType>(email: SendEmailRequest<T>): EmailData {
		console.log(this.logPrefix, `Prepare options to send to email ${email.to}`);
		const stub: EmailStub = this._server.generateEmail(email.type, email.fields);
		return {
			from: this._sender,
			to: email.to,
			subject: stub.subject,
			html: stub.body,
		} as EmailData;
	}

	private async _sendEmail(options: EmailData): Promise<void> {
		try {
			console.log(this.logPrefix, `Send email from ${options.from} to ${options.to}`);
			await this._transport.sendMail(options);
		} catch (e) {
			console.error('Failed to send email', e);
		}
	}

	public async send<T extends EmailType>(_email: SendEmailRequest<T>): Promise<void> {
		await this._sendEmail(this._prepareOptions(_email));
	}
}
