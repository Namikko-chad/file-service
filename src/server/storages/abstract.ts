import * as fileType from 'file-type';
import * as mimeType from 'mime-types';
import crypto from 'crypto';
import { config, } from '../config/config';
import { Errors, } from '../enum';
import { splitFilename, Exception, } from '../utils';
import { FileFormData, StorageParam, } from './interface';
import { StorageType, } from './enum';
import { File, } from '../db';

export abstract class AbstractStorage {
	abstract params: StorageParam;
	abstract type: StorageType;

	async getExt(name: string, file: Buffer): Promise<{ ext: string; mime: string }> {
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

		if (!ext || !mime) throw new Exception(Errors.InvalidPayload, 'Unsupported file type');

		if (!config.files.allowedExtensionsRegExp.exec(ext)) {
			throw new Exception(Errors.Forbidden, 'This media file extension forbidden');
		}

		return { ext, mime, };
	}

	getHash(data: Buffer): string {
		const hash_md5 = crypto.createHash('md5');
		hash_md5.update(data);
		return hash_md5.digest('hex');
	}

	abstract saveFile(file: FileFormData): Promise<File>;

	abstract loadFile(file: File): Promise<Buffer>;
	
	abstract deleteFile(file: File): Promise<void>;
}
