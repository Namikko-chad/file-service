import * as handlebars from 'handlebars';
import * as fs from 'fs';
import path from 'path';
import { EmailType, } from './email-generator.enum';
import {
	EmailStub,
	FieldsEmailRequest,
	Templates,
} from './email-generator.interfaces';

export class EmailGeneratorHandler {
	private readonly templates: Templates;
	private readonly templatesDir: string;

	constructor(_templates: Templates) {
		this.templates = _templates;
		this.templatesDir = './templates/email/';
	}

	public buildTemplate<T extends EmailType>(
		key: EmailType,
		fields: FieldsEmailRequest[T]
	): EmailStub {
		// eslint-disable-next-line security/detect-object-injection
		const pattern = this.templates[key];

		if (!pattern) throw new Error('Template pattern wasn\'t found');

		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const file = fs.readFileSync(
			path.resolve(this.templatesDir, pattern.path + '.handlebars'),
			'utf-8'
		);
		const template = handlebars.compile(file);
		const body = template(fields);

		return {
			subject: pattern.subject,
			body,
		};
	}
}
