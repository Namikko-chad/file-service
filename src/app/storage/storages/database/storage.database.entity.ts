import { Column, Entity, PrimaryColumn, } from 'typeorm';

@Entity({
  name: 'Storage',
})
export class Storage {
  @PrimaryColumn({
    type: 'uuid',
  })
    id!: string;

  @Column({
    type: 'bytea',
  })
    data!: Buffer;
}
