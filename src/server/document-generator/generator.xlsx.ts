import xlsx, { WorkSheet, } from 'node-xlsx';

import { AbstractGenerator, } from './abstract.generator';
import { DocumentMeta, } from './document-generator.interfaces';

export class xlsxGenerator extends AbstractGenerator {
  mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  ext = 'xlsx';

  generateContent(_template: Buffer, meta: DocumentMeta, data: WorkSheet<unknown>[]): Buffer {
    const template = xlsx.build([{ name: meta.name, data: data as unknown as string[][], options: {}, }]);

    return Buffer.from(new Uint8Array(template));
  }
}
