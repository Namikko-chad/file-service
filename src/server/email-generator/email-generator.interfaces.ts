import { EmailType, } from './email-generator.enum';

export type Templates = {
	[key in EmailType]: {
		subject: string;
		path: string;
	};
};

export const Templates: Templates = {
	[EmailType.Confirmation]: {
		subject: 'Crypton Outstaff Email confirmation',
		path: 'confirmation',
	},
	[EmailType.InviteInAdmin]: {
		subject: 'Invitation to outstaff',
		path: 'invation-in-admin',
	},
};

export interface EmailStub {
	subject: string;
	body: string;
}

export interface FieldsEmailRequest {
	readonly [EmailType.Confirmation]: EmailRequestWithCode;
	readonly [EmailType.InviteInAdmin]: InviteInAdmin;
}

interface EmailRequestWithCode {
	readonly code: string;
}

interface InviteInAdmin {
	readonly url: string;
}
