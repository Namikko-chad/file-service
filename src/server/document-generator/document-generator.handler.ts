import { AbstractGenerator } from './abstract.generator';
import { AbstractTemplate } from './abstract.template';
import { DocumentData, DocumentInput, DocumentMeta, } from './document-generator.interfaces';

export class DocumentGenerator {
	private generators = new Map<string, AbstractGenerator>();
	private templates = new Map<string, AbstractTemplate>();

	public registerGenerator(documentType: string, worker: AbstractGenerator): void {
		this.generators.set(documentType, worker);
	}

	public registerTemplate(templatesType: string, template: AbstractTemplate): void {
		this.templates.set(templatesType, template);
	}

	public async create(documentType: string, meta: DocumentMeta, data: DocumentInput): Promise<DocumentData> {
		const generator = this.generators.get(documentType);
		if (!generator)
			throw new ReferenceError('Unknown generator type');
		const template = this.templates.get(meta.template);
		if (!template)
			throw new ReferenceError('Unknown template type');
		const templateBuffer = await template.loadTemplate();
		const content = await generator.generateContent(templateBuffer, meta, data);
		const name = generator.generateName(meta);
		return {
			...meta,
			content,
			name,
			ext: generator.ext,
			mime: generator.mime
		};
	}
}
