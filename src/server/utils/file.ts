import * as p from 'path';
import * as fs from 'fs/promises';
import * as fileType from 'file-type';
import * as mimeType from 'mime-types';
import { config, } from '../config/config';
import { IFilename, } from '../interfaces/file';
import { Exception, } from './Exception';
import { Errors, } from '../enum/errors';
import { FileStorage, } from '../models/FileStorage';

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

export async function getExt(
	name: string,
	file: Buffer
): Promise<{ ext: string; mime: string }> {
	let ext = '';
	let mime = '';
	if (Buffer.isBuffer(file)) {
		const fileExt = await fileType.fromBuffer(file);
		if (fileExt) {
			ext = fileExt.ext;
			mime = fileExt.mime;
		}
	}
	// try search in filename
	if (!ext || !mime) {
		const splitName = splitFilename(name);
		ext = splitName.ext;
		mime = mimeType.lookup(name) as string;
	}

	if (!ext || !mime)
		throw new Exception(Errors.InvalidPayload, 'Unsupported file type');

	if (!config.files.allowedExtensionsRegExp.exec(ext)) {
		throw new Exception(
			Errors.Forbidden,
			'This media file extension forbidden'
		);
	}

	return { ext, mime, };
}

export async function saveFile(file: Buffer, name: string): Promise<void> {
	/* eslint-disable security/detect-non-literal-fs-filename */
	// try to get file extension
	const { ext, } = await getExt(name, file);

	// directory path
	const dirPath = p.join(config.files.filesDir);

	// create folders recursively
	await fs.mkdir(dirPath, { recursive: true, });

	// file name
	const fileName = `${name}.${ext}`;

	// file path
	const filePath = p.join(dirPath, fileName);

	// create file
	await fs.writeFile(filePath, file);
}

export async function deleteFile(file: FileStorage): Promise<void> {
	/* eslint-disable security/detect-non-literal-fs-filename */
	const filePath = p.join(
		config.files.filesDir,
		`${file.id}.${String(mimeType.extension(file.mime))}`
	);
	await fs.unlink(filePath);
}
