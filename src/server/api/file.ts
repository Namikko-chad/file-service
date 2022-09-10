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
import { File, FileUser, } from '../db';
import { fileResponse, } from '../helper/fileResponse';

function editAccess(r: Request, file: FileUser): void {
	const user = r.auth.credentials.user;
	if (file.userId !== user?.id && r.auth.artifacts.tokenType !== Token.Admin)
		throw new Exception(
			Errors.FileIsPrivate,
			ErrorsMessages[Errors.FileIsPrivate]
		);
}

function viewAccess(r: Request, file: FileUser): void {
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
		const { rows, count, } = await FileUser.findAndCountAll({
			where: {
				userId,
			},
			include: [
				{
					model: File,
					required: true,
				}
			],
		});

		return outputPagination(
			count,
			rows.map((row) => fileResponse(row, row.file))
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
		const fileUser = await FileUser.findByPk(fileId);
		if (!fileUser)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);

		viewAccess(r, fileUser);

		const file = await r.server.app.storage.loadFile(fileUser.fileId);

		const response: ResponseObject = h
			.response(file.data)
			.type(file.mime)
			.header('Connection', 'keep-alive')
			.header('Cache-Control', 'no-cache')
			.header(
				'Content-Disposition',
				'attachment; filename*=UTF-8\'\'' +
          encodeURIComponent(fileUser.name + '.' + file.ext)
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
		const fileUser = await FileUser.findByPk(fileId, {
			include: [
				{
					model: File,
					required: true,
				}
			],
		});
		if (!fileUser)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);

		viewAccess(r, fileUser);

		return outputOk(fileResponse(fileUser, fileUser.file));
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
		const file = await r.server.app.storage.saveFile(payload.file);
		const { name, } = splitFilename(payload.file.filename);
		const fileUser = await FileUser.create({
			userId,
			fileId: file.id,
			name,
			public: payload.public,
		});

		return outputOk(fileResponse(fileUser, file));
	} catch (err) {
		return handlerError('Create file error', err);
	}
}

export async function edit(r: Request): Promise<IOutputEmpty | Boom> {
	try {
		const payload = r.payload as IFileEditPayload;
		const { fileId, } = r.params as { fileId: string };
		const fileUser = await FileUser.findByPk(fileId);
		if (!fileUser)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);
		editAccess(r, fileUser);

		await fileUser.update({
			name: payload.name ? splitFilename(payload.name).name : fileUser.name,
			public: payload.public ?? fileUser.public,
		});
		return outputEmpty();
	} catch (err) {
		return handlerError('Edit file error', err);
	}
}

export async function destroy(r: Request): Promise<IOutputEmpty | Boom> {
	try {
		const { fileId, } = r.params as { fileId: string };
		const fileUser = await FileUser.findByPk(fileId);

		if (!fileUser)
			throw new Exception(
				Errors.FileNotFound,
				ErrorsMessages[Errors.FileNotFound],
				{ fileId, }
			);

		editAccess(r, fileUser);
		await fileUser.destroy();

		return outputEmpty();
	} catch (err) {
		return handlerError('Destroy file error', err);
	}
}
