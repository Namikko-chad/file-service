import { Column, Entity, } from 'typeorm';

import { AbstractEntity, } from '../../database/AbstractEntity';

@Entity()
export class File extends AbstractEntity {
  @Column({
    length: 10,
  })
    ext!: string;

  @Column({
    length: 255,
  })
    mime!: string;

  @Column({
    type: 'bigint',
  })
    size!: number;

  @Column({
    length: 255,
  })
    storage!: string;

  @Column({
    length: 255,
  })
    hash!: string;
}
