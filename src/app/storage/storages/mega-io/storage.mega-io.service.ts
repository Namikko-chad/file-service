import { Inject, } from '@nestjs/common';
import { Storage as MegaStorage, } from 'megajs';

import { File, } from '../../../files/entity';
import { AbstractStorage, } from '../storage.abstract.service';
import { MegaIOConfig, } from './storage.mega-io.config';

export class MegaIOStorage extends AbstractStorage {
  private storage?: MegaStorage;
 
  constructor(@Inject(MegaIOConfig) public override readonly config: MegaIOConfig) {
    super(config);
  }

  override async init(): Promise<void> {
    if (this.enabled) {
      const storage = new MegaStorage({
        email: this.config.email,
        password: this.config.password,
      }).ready;

      this.storage = await storage;
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
