import docxTemplater from 'docxtemplater';
import PizZip from 'pizzip';

import { AbstractGenerator, } from './abstract.generator';
import { DocumentMeta, } from './document-generator.interfaces';

export class docxGenerator extends AbstractGenerator {
  mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  ext = 'docx';

  async generateContent(template: Buffer, _meta: DocumentMeta, data: Record<string, string>): Promise<Buffer> {
    const templater = new docxTemplater(new PizZip(template));
    await templater.renderAsync(data);
    const zip = templater.getZip() as PizZip;

    return zip.generate({ type: 'nodebuffer', mimeType: this.mime, });
  }
}
