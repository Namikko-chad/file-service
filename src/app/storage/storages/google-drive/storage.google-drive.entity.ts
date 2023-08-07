import { Column, Entity, PrimaryColumn, } from 'typeorm';

@Entity({
  name: 'GoogleDrive',
})
export class GoogleDrive {
  @PrimaryColumn({
    type: 'uuid',
  })
    fileId!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
    driveId!: string;
}
