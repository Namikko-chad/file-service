import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, } from 'typeorm';
import { v4 as uuidv4, } from 'uuid';

import { SchedulerStatus, } from './scheduler.enum';

@Entity({
  schema: 'logs',
})
export class SchedulerTask {
  @PrimaryGeneratedColumn('uuid', {})
    id: string = uuidv4();

  @Column({
    length: 255,
    nullable: false,
  })
    name!: string;
 
  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
    startedAt!: Date;
 
  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
    finishedAt!: Date;
 
  @Column({
    type: 'enum',
    enum: SchedulerStatus,
    nullable: false,
    default: SchedulerStatus.Started,
  })
    status!: SchedulerStatus;
 
  @Column({
    type: 'text',
    nullable: true,
  })
    error!: string;
}