import { Request, ResponseObject, ResponseToolkit, } from '@hapi/hapi';
import { Boom, } from '@hapi/boom';
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
	handlerError,
	outputPagination,
	Token,
} from '../utils';
import { Errors, ErrorsMessages, } from '../enum';
import { File, FileStorage, } from '../db';
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
		const file = await File.findByPk(fileId);
		if (!file)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);

		viewAccess(r, file);

		const fileStorage = await r.server.app.storage.loadFile(file.fileStorageId);

		const response: ResponseObject = h
			.response(fileStorage.data)
			.type(fileStorage.mime)
			.header('Connection', 'keep-alive')
			.header('Cache-Control', 'no-cache')
			.header(
				'Content-Disposition',
				'attachment; filename*=UTF-8\'\'' +
          encodeURIComponent(file.name + '.' + fileStorage.ext)
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
		const fileStorage = await r.server.app.storage.saveFile(payload.file);
		const { name, } = splitFilename(payload.file.filename);
		const file = await File.create({
			userId,
			fileStorageId: fileStorage.id,
			name,
			public: payload.public,
		});
		return outputOk(fileResponse(file, fileStorage));
	} catch (err) {
		return handlerError('Create file error', err);
	}
}

export async function edit(
	r: Request
): Promise<IOutputOk<IFileResponse> | Boom> {
	try {
		const payload = r.payload as IFileEditPayload;
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
		editAccess(r, file);
		let fileStorage = file.fileStorage;
		if (
			payload?.file &&
      payload?.file.filename &&
      payload.file.payload.length
		) {
			fileStorage = await r.server.app.storage.saveFile(payload.file);
		}

		await file.update({
			fileStorageId: fileStorage.id,
			name: payload.name,
			public: payload.public,
		});
		return outputOk(fileResponse(file, fileStorage));
	} catch (err) {
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
