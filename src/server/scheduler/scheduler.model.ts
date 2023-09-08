import { fn, } from 'sequelize';
import { Column, DataType, Model, Table, } from 'sequelize-typescript';

import { getUUID, } from '../utils';
import { SchedulerStatus, } from './scheduler.enum';

@Table({
  schema: 'logs',
  timestamps: false,
})
export class SchedulerTask extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: () => getUUID(),
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: fn('now'),
  })
  declare startedAt: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare finishedAt: string;

  @Column({
    type: DataType.ENUM(...Object.values(SchedulerStatus)),
    allowNull: false,
    defaultValue: SchedulerStatus.Started,
  })
  declare status: SchedulerStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare error: string;
}
