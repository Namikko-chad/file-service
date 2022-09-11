import { IFilename, } from '../interfaces/file';

/**
 * Method for split filename to name and file ext
 * @param filename string
 * @returns object with property: ext: string, name: string
 */
export function splitFilename(filename: string): IFilename {
	let ext = '';
	let name = filename;
	if (filename.includes('.')) {
		const parts = filename.split('.');
		if (parts.length > 1) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			ext = parts[parts.length - 1].toLowerCase();
			parts.pop();
			name = filename.slice(0, filename.length - ext.length - 1);
		}
	}
	return { name, ext, };
}
