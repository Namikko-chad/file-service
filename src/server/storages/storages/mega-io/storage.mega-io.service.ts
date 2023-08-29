import { Storage as MegaStorage, } from 'megajs';

import { Errors, ErrorsMessages, } from '../../../enum';
import { File, } from '../../../files';
import { Exception, } from '../../../utils';
import { AbstractStorage, } from '../storage.abstract.service';
import { MegaIOConfig, } from './storage.mega-io.config';

export class MegaIOStorage extends AbstractStorage {
  private storage: MegaStorage;
  override config: MegaIOConfig;

  constructor() {
    const config = new MegaIOConfig();
    super(config);
    this.config = config;
    this.storage = new MegaStorage({
      email: this.config.email,
      password: this.config.password,
    });
  }

  override async init(): Promise<void> {
    if (this.enabled) {
      const storage = this.storage.ready;

      this.storage = await storage;
    }
  }

  async saveFile({ id: fileId, }: File, data: Buffer): Promise<void> {
    await this.storage.upload(fileId, data).complete;
  }

  async loadFile({ id: fileId, }: File): Promise<Buffer> {
    const file = this.storage.root.children?.find( file => file.name === fileId );
    if (!file)
      throw new Exception(Errors.FileNotFound, ErrorsMessages[Errors.FileNotFound]);
    const buffer = await file.downloadBuffer({});

    return buffer;
  }

  async deleteFile({ id: fileId, }: File): Promise<void> {
    const file = this.storage.root.children?.find( file => file.name === fileId );
    if (!file)
      throw new Exception(Errors.FileNotFound, ErrorsMessages[Errors.FileNotFound]);
    await file.delete(true);
  }
}
