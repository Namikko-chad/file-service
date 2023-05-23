import { Plugin, Server, } from '@hapi/hapi';

import { DocumentGenerator, } from './document-generator.handler';
import { DocumentGeneratorOptions, } from './document-generator.options';
import { docxGenerator, } from './generator.docx';
import { htmlGenerator, } from './generator.html';
import { xlsxGenerator, } from './generator.xlsx';
import { xlsxEmptyTemplate, } from './template.xlsx-empty';

declare module '@hapi/hapi' {
  export interface ServerApplicationState {
    documentGenerator: DocumentGenerator;
  }
}

export const DocumentGeneratorPlugin: Plugin<DocumentGeneratorOptions> = {
  name: 'document-generator',
  register(server: Server, options: DocumentGeneratorOptions = {}): void {
    server.app.documentGenerator = new DocumentGenerator();
    [docxGenerator, xlsxGenerator, htmlGenerator].forEach((generator) =>
      server.app.documentGenerator.registerGenerator(generator.name, new generator(options))
    );
    server.app.documentGenerator.registerTemplate(xlsxEmptyTemplate.name, new xlsxEmptyTemplate(options));
  },
};
