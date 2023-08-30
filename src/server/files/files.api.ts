import { Boom, } from '@hapi/boom';
import { Request, ResponseObject, ResponseToolkit, } from '@hapi/hapi';

import { Token, } from '../auth';
import { Errors, ErrorsMessages, } from '../enum';
import { IOutputEmpty, IOutputOk, IOutputPagination, } from '../interfaces';
import { Exception, handlerError, outputEmpty, outputOk, outputPagination, } from '../utils';
import { filesConfig, } from './files.config';
import { FilesErrors, FilesErrorsMessages, } from './files.errors';
import { fileResponse, } from './files.helper';
import { IFileCreatePayload,IFileEditPayload, IFileResponse, } from './files.interfaces';
import { File, } from './models/File.model';
import { FileUser, } from './models/FileUser.model';

function editAccess(r: Request, file: FileUser): void {
  const user = r.auth.credentials.user;
  if (file.userId !== user?.id && r.auth.artifacts.tokenType !== Token.Admin)
    throw new Exception(FilesErrors.FileIsPrivate, FilesErrorsMessages[FilesErrors.FileIsPrivate]);
}

function viewAccess(r: Request, file: FileUser): void {
  if (!file.public) {
    if (!r.auth.isAuthenticated) throw new Exception(FilesErrors.FileIsPrivate, FilesErrorsMessages[FilesErrors.FileIsPrivate]);
    const user = r.auth.credentials.user;

    switch (r.auth.artifacts.tokenType) {
      case Token.User:
        if (file.userId !== user?.id) throw new Exception(FilesErrors.FileIsPrivate, FilesErrorsMessages[FilesErrors.FileIsPrivate]);
        break;
      case Token.File:
        if (file.id !== r.auth.credentials.fileId) throw new Exception(FilesErrors.FileIsPrivate, FilesErrorsMessages[FilesErrors.FileIsPrivate]);
    }
  }
}

export async function list(r: Request): Promise<IOutputPagination<IFileResponse[]> | Boom> {
  try {
    const user = r.auth.credentials.user;
    if (!user) throw new Exception(Errors.UserNotFound, ErrorsMessages[Errors.UserNotFound]);
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

export async function retrieve(r: Request, h: ResponseToolkit): Promise<ResponseObject | Boom> {
  try {
    const { fileId, } = r.params as { fileId: string };
    const fileUser = await FileUser.findByPk(fileId);
    if (!fileUser) throw new Exception(FilesErrors.FileNotFound, FilesErrorsMessages[FilesErrors.FileNotFound], { fileId, });

    viewAccess(r, fileUser);

    const [file, data] = await r.server.app.storage.loadFile(fileUser.fileId);

    const response: ResponseObject = h
      .response(data)
      .type(file.mime)
      .header('Connection', 'keep-alive')
      .header('Cache-Control', 'no-cache')
      .header('Content-Disposition', 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(`${fileUser.name}.${file.ext}`));

    return response;
  } catch (err) {
    return handlerError('Failed retrieve file', err);
  }
}

export async function info(r: Request): Promise<IOutputOk<IFileResponse> | Boom> {
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
    if (!fileUser) throw new Exception(FilesErrors.FileNotFound, FilesErrorsMessages[FilesErrors.FileNotFound], { fileId, });

    viewAccess(r, fileUser);

    return outputOk(fileResponse(fileUser, fileUser.file));
  } catch (err) {
    return handlerError('Failed retrieve file info', err);
  }
}

export async function create(r: Request, h: ResponseToolkit): Promise<ResponseObject | IOutputOk<IFileResponse> | Boom> {
  try {
    const payload = r.payload as IFileCreatePayload;
    if (!payload?.file || !payload?.file.filename || !payload.file.payload.length)
      throw new Exception(Errors.InvalidPayload, ErrorsMessages[Errors.InvalidPayload]);
    const user = r.auth.credentials.user;
    if (!user) throw new Exception(Errors.UserNotFound, ErrorsMessages[Errors.UserNotFound]);
    const { id: userId, } = user;
    const files = await FileUser.findAll({
      where: {
        userId,
      },
      attributes: ['fileId'],
    });
    const usedCapacity = await r.server.app.storage.sizeFile(files.map((file) => file.fileId));
    if (usedCapacity + payload.file.payload.length > filesConfig.files.capacityPerUser)
      throw new Exception(Errors.StorageLimit, ErrorsMessages[Errors.StorageLimit]);
    const file = await r.server.app.storage.saveFile(payload.file);
    const { name, } = r.server.app.storage.splitFilename(payload.file.filename);
    const [fileUser] = await FileUser.findOrCreate({
      where: {
        userId,
        fileId: file.id,
        name,
      },
      defaults: {
        userId,
        fileId: file.id,
        name,
      },
    });

    return h.response(outputOk(fileResponse(fileUser, file))).code(201);
  } catch (err) {
    return handlerError('Create file error', err);
  }
}

export async function edit(r: Request): Promise<IOutputEmpty | Boom> {
  try {
    const payload = r.payload as IFileEditPayload;
    const { fileId, } = r.params as { fileId: string };
    const fileUser = await FileUser.findByPk(fileId);
    if (!fileUser) throw new Exception(FilesErrors.FileNotFound, FilesErrorsMessages[FilesErrors.FileNotFound], { fileId, });
    editAccess(r, fileUser);

    await fileUser.update({
      name: payload.name ? r.server.app.storage.splitFilename(payload.name).name : fileUser.name,
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

    if (!fileUser) throw new Exception(FilesErrors.FileNotFound, FilesErrorsMessages[FilesErrors.FileNotFound], { fileId, });

    editAccess(r, fileUser);
    await fileUser.destroy();

    return outputEmpty();
  } catch (err) {
    return handlerError('Destroy file error', err);
  }
}
