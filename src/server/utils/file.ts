import { IFilename, } from '../interfaces/file';

export function splitFilename(filename: string): IFilename {
	let ext = '';
	let name = filename;
	if (filename.includes('.')) {
		const parts = filename.split('.');
		if (parts.length > 1) {
			ext = parts[parts.length - 1].toLowerCase();
			parts.pop();
			name = filename.slice(0, filename.length - ext.length - 1);
		}
	}
	return { name, ext, };
}
