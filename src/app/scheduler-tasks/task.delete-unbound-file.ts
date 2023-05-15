import { Inject, Injectable, } from '@nestjs/common';
import { Cron, } from '@nestjs/schedule';
import { QueryRunner, } from 'typeorm';

import { FileUser, } from 'app/files/entity';
import { FileRepository, } from 'app/files/repositories';
import { StorageService, } from 'app/storage/storage.service';

import { AbstractTask, } from './abstract-task';

@Injectable()
export class DeleteUnboundFileTask extends AbstractTask {
  @Inject(FileRepository)
  private readonly _fileRepository: FileRepository;
  @Inject(StorageService)
  private readonly _storage: StorageService;

  @Cron('0 0 * * * *', {
    name: DeleteUnboundFileTask.name,
  })
  async handler(_queryRunner?: QueryRunner): Promise<void> {
    const queryBuilder = this._fileRepository.createQueryBuilder(undefined, _queryRunner);
    queryBuilder.leftJoinAndSelect(FileUser, 'fileUsers', '"File"."id" = "fileUsers"."fileId"');
    queryBuilder.where('"fileUsers"."fileId" IS NULL');
    queryBuilder.select('"File".id');
    const unboundFiles = await queryBuilder.execute() as { id: string; }[];
    await Promise.all(unboundFiles.map((file) => this._storage.deleteFile(file.id)));
  };
}
