import xlsx, { WorkSheet } from 'node-xlsx';
import { AbstractGenerator } from './abstract.generator';
import { DocumentMeta } from './document-generator.interfaces';

export class xlsxGenerator extends AbstractGenerator {
  mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
	ext = 'xlsx';

  async generateContent(
		_template: Buffer,
		_meta: DocumentMeta,
		data: WorkSheet<unknown>[]
	): Promise<Buffer> {
		const template = xlsx.build(data);
		return Buffer.from(new Uint8Array(template));
	}
}