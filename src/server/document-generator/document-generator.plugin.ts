import { Plugin, Server, } from '@hapi/hapi';
import { DocumentGeneratorOptions, } from './document-generator.options';
import { DocumentGenerator, } from './document-generator.handler';
import { docxGenerator, } from './generator.docx';
import { htmlGenerator, } from './generator.html';
import { xlsxGenerator, } from './generator.xlsx';

declare module '@hapi/hapi' {
  export interface ServerApplicationState {
    documentGenerator: DocumentGenerator;
  }
}

export const DocumentGeneratorPlugin: Plugin<DocumentGeneratorOptions> = {
	name: 'document-generator',
	register(server: Server, options: DocumentGeneratorOptions = {}): void {
		server.app.documentGenerator = new DocumentGenerator();
		server.app.documentGenerator.registerGenerator(
			'docx',
			new docxGenerator(options)
		);
		server.app.documentGenerator.registerGenerator(
			'xlsx',
			new xlsxGenerator(options)
		);
		server.app.documentGenerator.registerGenerator(
			'html',
			new htmlGenerator(options)
		);
	},
};
