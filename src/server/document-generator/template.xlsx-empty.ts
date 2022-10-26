import { AbstractTemplate, } from './abstract.template';

export class xlsxEmptyTemplate extends AbstractTemplate {
	name = 'empty-xlsx';

	// eslint-disable-next-line @typescript-eslint/require-await
	public override async loadTemplate(): Promise<Buffer> {
		return Buffer.from('');
	}
}
