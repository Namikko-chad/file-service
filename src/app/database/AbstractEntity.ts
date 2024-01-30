import { CreateDateColumn, ObjectLiteral, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { v4 as uuidv4, } from 'uuid';

export abstract class AbstractEntity implements ObjectLiteral {
  @PrimaryGeneratedColumn('uuid', {})
    id: string = uuidv4();

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
    createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
    updatedAt!: Date;
}
