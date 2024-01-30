import { Inject, Injectable, } from '@nestjs/common';
import { Cron, } from '@nestjs/schedule';

import { AbstractTask, } from '../scheduler';
import { StorageService, } from '../storage';

@Injectable()
export class DeleteUnboundFileTask extends AbstractTask {
  override taskName = DeleteUnboundFileTask.name;
  @Inject(StorageService)
  private readonly _storage: StorageService;

  @Cron('0 0 * * *', {
    name: DeleteUnboundFileTask.name,
  })
  override async handler(): Promise<void> {
    await super.handler();
  };

  async task(): Promise<void> {
    const files = await this._ds.file.findMany({
      where: {
        FileUser: {
          every: {
            id: null,
          },
        },
      },
    });
    await Promise.all(
      files.map( file => this._storage.deleteFile(file.id) )
    );
  }
}
