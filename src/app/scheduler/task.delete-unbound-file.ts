import { Inject, Injectable, } from '@nestjs/common';
import { Cron, } from '@nestjs/schedule';
import { QueryRunner, } from 'typeorm';

import { FileRepository,FileUser,  } from '../files';
import { StorageService, } from '../storage';
import { AbstractTask, } from './abstract-task';

@Injectable()
export class DeleteUnboundFileTask extends AbstractTask {
  override taskName = DeleteUnboundFileTask.name;
  @Inject(FileRepository)
  private readonly _fileRepository: FileRepository;
  @Inject(StorageService)
  private readonly _storage: StorageService;

  @Cron('0 0 * * *', {
    name: DeleteUnboundFileTask.name,
  })
  override async handler(queryRunner?: QueryRunner): Promise<void> {
    await super.handler(queryRunner);
  };

  async task(queryRunner?: QueryRunner): Promise<void> {
    const queryBuilder = this._fileRepository.createQueryBuilder(undefined, queryRunner);
    queryBuilder.leftJoinAndSelect(FileUser, 'fileUsers', '"File"."id" = "fileUsers"."fileId"');
    queryBuilder.where('"fileUsers"."fileId" IS NULL');
    queryBuilder.select('"File".id');
    const unboundFiles = await queryBuilder.execute() as { id: string; }[];
    await Promise.all(unboundFiles.map((file) => this._storage.deleteFile(file.id)));
  }
}
