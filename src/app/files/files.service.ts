import { Injectable, } from '@nestjs/common';
import { FindOptionsWhere, } from 'typeorm';

import { ListDto, } from '../dto';
import { Errors, ErrorsMessages, } from '../enum/errors';
import { StorageService, } from '../storage/storage.service';
import { Exception, } from '../utils/Exception';
import { Utils, } from '../utils/utils';
import { FileEditDto, FileInfoDto, } from './dto';
import { FileUser, } from './entity/file-user.entity';
import { FileUserRepository, } from './repositories/file-user.repository';

@Injectable()
export class FileService {
  constructor(private readonly _fileUserRepository: FileUserRepository, private readonly _storage: StorageService) {}

  async list(userId: string, listParam: ListDto<FileUser>): Promise<[FileUser[], number]> {
    const condition = Utils.listParam<FileUser>(listParam, ['name']);
    (condition.where as FindOptionsWhere<FileUser>[])[0] = { ...(condition.where as FindOptionsWhere<FileUser>[])[0], userId, };

    return this._fileUserRepository.findAndCount({
      ...condition,
      relations: ['file'],
    });
  }

  async create(userId: string, payload: Express.Multer.File): Promise<FileUser> {
    const file = await this._storage.saveFile({
      filename: payload.originalname,
      headers: {},
      payload: payload.buffer,
    });
    const [fileUser] = await this._fileUserRepository.findOrCreate(
      {
        userId,
        fileId: file.id,
        name: payload.originalname,
      },
      {
        userId,
        fileId: file.id,
        name: payload.originalname,
      }
    );
    fileUser.file = file;

    return fileUser;
  }

  async update(fileId: string, payload: FileEditDto): Promise<FileUser> {
    const fileUser = await this.retrieveInfo(fileId);
    await this._fileUserRepository.update(fileId, {
      public: payload.public ?? fileUser.public,
      name: payload.name ?? fileUser.name,
    });
    await this._fileUserRepository.reload(fileUser);

    return fileUser;
  }

  async delete(fileId: string): Promise<void> {
    await this._fileUserRepository.delete(fileId);
  }

  async retrieve(fileId: string): Promise<[FileUser, Buffer]> {
    const fileUser = await this._fileUserRepository.findOne({
      where: {
        id: fileId,
      },
      relations: ['file'],
    });
    if (!fileUser)
      throw new Exception(Errors.FileNotFound, ErrorsMessages[Errors.FileNotFound], {
        fileId,
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, storage] = await this._storage.loadFile(fileUser.fileId);

    return [fileUser, storage];
  }

  async retrieveInfo(fileId: string): Promise<FileUser> {
    const file = await this._fileUserRepository.findOne({
      where: {
        id: fileId,
      },
      relations: ['file'],
    });
    if (!file)
      throw new Exception(Errors.FileNotFound, ErrorsMessages[Errors.FileNotFound], {
        fileId,
      });

    return file;
  }

  fileResponse(fileUser: FileUser): FileInfoDto {
    return {
      id: fileUser.id,
      name: fileUser.name,
      ext: fileUser.file.ext,
      mime: fileUser.file.mime,
      size: fileUser.file.size,
      public: fileUser.public,
      userId: fileUser.userId,
      hash: fileUser.file.hash,
    };
  }
}
