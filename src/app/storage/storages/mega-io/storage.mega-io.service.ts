import { Inject, } from '@nestjs/common';
import { Storage as MegaStorage, } from 'megajs';

import { File, } from '../../../files/entity';
import { AbstractStorage, } from '../storage.abstract.service';
import { MegaIOConfig, } from './storage.mega-io.config';

export class MegaIOStorage extends AbstractStorage {
  private storage?: MegaStorage;
 
  constructor(@Inject(MegaIOConfig) config: MegaIOConfig) {
    super(config);

    if (this.enabled) {
      this.storage = new MegaStorage({
        email: config.email,
        password: config.password,
      }).ready;
    }
  }

  async saveFile({ id: fileId, }: File, data: Buffer): Promise<void> {
    await this.storage.upload(fileId, data).complete;
  }

  async loadFile({ id: fileId, }: File): Promise<Buffer> {
    const file = this.storage?.root.children.find( file => file.name === fileId );
    const buffer = await file.downloadBuffer({});

    return buffer;
  }

  async deleteFile({ id: fileId, }: File): Promise<void> {
    const file = this.storage?.root.children.find( file => file.name === fileId );
    await file.delete(true);
  }
}
