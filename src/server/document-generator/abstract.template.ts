import fs from 'fs/promises';
import path from 'path';
import { DocumentTemplate } from './document-generator.interfaces';
import { DocumentGeneratorOptions } from './document-generator.options';

export abstract class AbstractTemplate implements DocumentTemplate {
	private readonly templatesDir: string;
	abstract name: string;

  constructor ({ templatesDir = 'templates/document', }: DocumentGeneratorOptions) {
		this.templatesDir = path.resolve(templatesDir);
  }

	public async loadTemplate(): Promise<Buffer> {
		const templatePath = path.resolve(this.templatesDir, this.name);
		return await fs.readFile(templatePath);
	}
}