import { QueryRunner, } from 'typeorm';

export abstract class AbstractTask {
  protected readonly logPrefix = '[Task:handler]';

  abstract handler(queryRunner?: QueryRunner): Promise<void>;
}
