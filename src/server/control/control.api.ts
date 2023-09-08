import { Boom, } from '@hapi/boom';
import { Request, } from '@hapi/hapi';

import { File, fileResponse, FileUser, IFileResponse, } from '../files';
import { listParam, } from '../helper/listParam';
import { IListParam,IOutputEmpty, IOutputPagination, } from '../interfaces';
import { handlerError, outputEmpty, outputPagination, } from '../utils';

export async function list(r: Request): Promise<IOutputPagination<IFileResponse[]> | Boom> {
  try {
    const query = r.query as IListParam & { userId: string };
    const params = listParam(query);
    Object.assign(params.where, { userId: query.userId, });
    const { rows, count, } = await FileUser.findAndCountAll({
      ...params,
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

export async function flushStorage(r: Request): Promise<IOutputEmpty | Boom> {
  try {
    const oldFiles = await File.findAll({
      include: [
        {
          model: FileUser,
          where: {
            id: null,
          },
        }
      ],
    });
    await Promise.all(oldFiles.map((file) => r.server.app.storage.deleteFile(file.id)));

    return outputEmpty();
  } catch (err) {
    return handlerError('Failed flush storage', err);
  }
}
