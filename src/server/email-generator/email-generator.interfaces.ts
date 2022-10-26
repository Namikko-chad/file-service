import { EmailType, } from './email-generator.enum';

export type Templates = {
	[key in EmailType]: {
		subject: string;
		path: string;
	};
};

export const Templates: Templates = {
	[EmailType.Confirmation]: {
		subject: 'Confirmation',
		path: 'confirmation',
	},
	[EmailType.Test]: {
		subject: 'Test',
		path: 'test',
	},
};

export interface EmailStub {
	subject: string;
	body: string;
}

export interface FieldsEmailRequest {
	readonly [EmailType.Confirmation]: EmailRequestWithCode;
	readonly [EmailType.Test]: EmailRequestWithCode;
}

interface EmailRequestWithCode {
	readonly code: string;
}