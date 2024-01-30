import { Column, Entity, JoinColumn, ManyToOne, } from 'typeorm';

import { AbstractEntity, } from '../../database/AbstractEntity';
import { File, } from './file.entity';

@Entity()
export class FileUser extends AbstractEntity {
  @Column({
    type: 'uuid',
  })
    userId: string;

  @Column({
    type: 'uuid',
  })
    fileId: string;

  @Column({
    length: 255,
  })
    name!: string;

  @Column({
    default: false,
    nullable: true,
  })
    public: boolean;

  @ManyToOne(() => File, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'FileUsers_fileId_fkey',
  })
    file!: File;
}
