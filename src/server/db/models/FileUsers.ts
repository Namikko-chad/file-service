import {
	Column,
	DataType,
	Model,
	Table,
	Scopes,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript';
import { getUUID, } from '../../utils/index';
import { File, } from './File';

@Scopes(() => ({
	defaultScope: {
		attributes: {
			exclude: ['createdAt', 'updatedAt'],
		},
	},
}))
@Table({})
export class FileUser extends Model {
  @Column({
  	type: DataType.UUID,
  	primaryKey: true,
  	unique: true,
  	defaultValue: () => getUUID(),
  })
	override id!: string;

  @Column({
  	type: DataType.UUID,
  	allowNull: false,
  })
  	userId!: string;

  @ForeignKey(() => File)
  @Column({
  	type: DataType.UUID,
  	allowNull: false,
  })
  	fileId!: string;

  @Column({
  	type: DataType.STRING,
  	allowNull: false,
  })
  	name!: string;

  @Column({
  	type: DataType.BOOLEAN,
  	defaultValue: false,
  })
  	public!: boolean;

  @BelongsTo(() => File)
  	file!: File;
}
