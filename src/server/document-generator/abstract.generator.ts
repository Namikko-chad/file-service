import { DocumentInput, DocumentMeta, } from './document-generator.interfaces';
import { DocumentGeneratorOptions, } from './document-generator.options';

export abstract class AbstractGenerator {
  abstract readonly mime: string;
  abstract readonly ext: string;

  constructor(private options: DocumentGeneratorOptions) {
  	this.options;
  }

  abstract generateContent(
    template: Buffer,
    meta: DocumentMeta,
    data: DocumentInput
  ): Promise<Buffer> | Buffer;

  public generateName(meta: DocumentMeta): string {
  	return `${meta.name}.${this.ext}`;
  }
}
