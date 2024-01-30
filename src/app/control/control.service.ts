import { Injectable, } from '@nestjs/common';


@Injectable()
export class ControlService {

  async flushStorage(_: string): Promise<void> {
    await Promise.resolve();
  }
}
