import { Request, ResponseObject, ResponseToolkit, } from '@hapi/hapi';
import { Boom, } from '@hapi/boom';
import * as p from 'path';
import { config, } from '../config/config';
import {
	IOutputEmpty,
	IOutputOk,
	IFileResponse,
	IOutputPagination,
	IFileEditPayload,
	IFileCreatePayload,
} from '../interfaces';
import {
	outputOk,
	outputEmpty,
	Exception,
	splitFilename,
	getExt,
	saveFile,
	handlerError,
	outputPagination,
	Token,
	getHash, 
} from '../utils';
import { Errors, ErrorsMessages, } from '../enum';
import { File, FileStorage, Storage, } from '../models';
import { fileResponse, } from '../helper/fileResponse';

function editAccess(r: Request, file: File): void {
	const user = r.auth.credentials.user;
	if (file.userId !== user?.id && r.auth.artifacts.tokenType !== Token.Admin)
		throw new Exception(
			Errors.FileIsPrivate,
			ErrorsMessages[Errors.FileIsPrivate]
		);
}

function viewAccess(r: Request, file: File): void {
	if (!file.public) {
		if (!r.auth.isAuthenticated)
			throw new Exception(
				Errors.FileIsPrivate,
				ErrorsMessages[Errors.FileIsPrivate]
			);
		const user = r.auth.credentials.user;
		switch (r.auth.artifacts.tokenType) {
		case Token.User:
			if (file.userId !== user?.id)
				throw new Exception(
					Errors.FileIsPrivate,
					ErrorsMessages[Errors.FileIsPrivate]
				);
			break;
		case Token.File:
			if (file.id !== r.auth.credentials.fileId)
				throw new Exception(
					Errors.FileIsPrivate,
					ErrorsMessages[Errors.FileIsPrivate]
				);
		}
	}
}

export async function list(
	r: Request
): Promise<IOutputPagination<IFileResponse[]> | Boom> {
	try {
		const user = r.auth.credentials.user;
		if (!user)
			throw new Exception(
				Errors.UserNotFound,
				ErrorsMessages[Errors.UserNotFound]
			);
		const { id: userId, } = user;
		const { rows, count, } = await File.findAndCountAll({
			where: {
				userId,
			},
			include: [
				{
					model: FileStorage,
					required: true,
				}
			],
		});

		return outputPagination(
			count,
			rows.map((row) => fileResponse(row, row.fileStorage))
		);
	} catch (err) {
		return handlerError('Failed get file list', err);
	}
}

export async function retrieve(
	r: Request,
	h: ResponseToolkit
): Promise<ResponseObject | Boom> {
	try {
		const { fileId, } = r.params as { fileId: string };
		const file = await File.findByPk(fileId, {
			include: [
				{
					model: FileStorage.scope('withData'),
					required: true,
				}
			],
		});
		if (!file)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);

		viewAccess(r, file);

		if (config.storage === Storage.FOLDER) {
			const filePath = p.join(
				config.files.filesDir,
				file.fileStorage.id + '.' + file.fileStorage.ext
			);
			file.fileStorage.data = Buffer.from(filePath);
		}

		const response: ResponseObject = h
			.response(file.fileStorage.data)
			.type(file.fileStorage.mime)
			.header('Connection', 'keep-alive')
			.header('Cache-Control', 'no-cache')
			.header(
				'Content-Disposition',
				'attachment; filename*=UTF-8\'\'' +
          encodeURIComponent(file.name + '.' + file.fileStorage.ext)
			);
		return response;
	} catch (err) {
		return handlerError('Failed retrieve file', err);
	}
}

export async function info(
	r: Request
): Promise<IOutputOk<IFileResponse> | Boom> {
	try {
		const { fileId, } = r.params as { fileId: string };
		const file = await File.findByPk(fileId, {
			include: [
				{
					model: FileStorage,
					required: true,
				}
			],
		});
		if (!file)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);

		viewAccess(r, file);

		return outputOk(fileResponse(file, file.fileStorage));
	} catch (err) {
		return handlerError('Failed retrieve file info', err);
	}
}

export async function create(
	r: Request
): Promise<IOutputOk<IFileResponse> | Boom> {
	console.log(r.payload)
	const transaction = await config.db.transaction();
	try {
		const payload = r.payload as IFileCreatePayload;
		if (
			!payload?.file ||
      !payload?.file.filename ||
      !payload.file.payload.length
		)
			throw new Exception(
				Errors.InvalidPayload,
				ErrorsMessages[Errors.InvalidPayload]
			);
		const user = r.auth.credentials.user;
		if (!user)
			throw new Exception(
				Errors.UserNotFound,
				ErrorsMessages[Errors.UserNotFound]
			);
		const { id: userId, } = user;
		const { name, } = splitFilename(payload.file.filename);
		const { mime, ext, } = await getExt(
			payload.file.filename,
			payload.file.payload
		);
		const hash = getHash(payload.file.payload);
		console.log(hash)
		const [fileStorage, created] = await FileStorage.findOrCreate({
			where: {
				hash,
			},
			defaults: {
				ext,
				mime,
				storage: config.storage,
				hash,
				data: config.storage === Storage.DB ? payload.file.payload : null,
			},
			transaction,
		});
		const file = await File.create({
			userId,
			fileStorageId: fileStorage.id,
			name,
			public: payload.public,
		}, { transaction, });
		if (created && config.storage === Storage.FOLDER)
			await saveFile(payload.file.payload, fileStorage.id);
		if (config.debug)
			console.info('Upload file', fileResponse(file, fileStorage));
		await transaction.commit();
		return outputOk(fileResponse(file, fileStorage));
	} catch (err) {
		await transaction.rollback();
		return handlerError('Create file error', err);
	}
}

export async function edit(
	r: Request
): Promise<IOutputOk<IFileResponse> | Boom> {
	const transaction = await config.db.transaction();
	console.log(r.payload)
	try {
		const payload = r.payload as IFileEditPayload;
		const { fileId, } = r.params as { fileId: string };
		const file = await File.findByPk(fileId, {
			include: [
				{
					model: FileStorage,
				}
			],
			transaction,
		});
		if (!file)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);
		editAccess(r, file);
		let fileStorageId = file.fileStorageId;
		if (
			payload?.file &&
      payload?.file.filename &&
      payload.file.payload.length
		) {
			const { mime, ext, } = await getExt(
				payload.file.filename,
				payload.file.payload
			);
			const hash = getHash(payload.file.payload);
			console.log(hash)
			const [fileStorage] = await FileStorage.findOrCreate({
				where: {
					hash,
				},
				defaults: {
					ext,
					mime,
					storage: config.storage,
					hash,
					data:
            config.storage === Storage.DB ? payload.file.payload : null,
				},
				transaction,
			});
			fileStorageId = fileStorage.id;
		}

		await file.update({
			fileId: fileStorageId,
			name: payload.name,
			public: payload.public,
		}, { transaction, });
		if (config.debug)
			console.info('Edit file', fileResponse(file, file.fileStorage));
		await transaction.commit();
		return outputOk(fileResponse(file, file.fileStorage));
	} catch (err) {
		await transaction.rollback();
		return handlerError('Edit file error', err);
	}
}

export async function destroy(r: Request): Promise<IOutputEmpty | Boom> {
	try {
		const { fileId, } = r.params as { fileId: string };
		const file = await File.findByPk(fileId);

		if (!file)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);

		editAccess(r, file);
		await file.destroy();

		return outputEmpty();
	} catch (err) {
		return handlerError('Destroy file error', err);
	}
}
