import handlebars from 'handlebars';

import { AbstractGenerator, } from './abstract.generator';
import { DocumentMeta, } from './document-generator.interfaces';

export class htmlGenerator extends AbstractGenerator {
  mime = 'text/html';
  ext = 'html';

  generateContent(template: Buffer, _meta: DocumentMeta, data: Record<string, string>): Buffer {
    const templater = handlebars.compile(template.toString());

    return Buffer.from(templater(data).toString());
  }
}
