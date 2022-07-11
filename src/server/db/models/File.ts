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
import { FileStorage, } from './FileStorage';

@Scopes(() => ({
	defaultScope: {
		attributes: {
			exclude: ['createdAt', 'updatedAt'],
		},
	},
}))
@Table({})
export class File extends Model {
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

  @ForeignKey(() => FileStorage)
  @Column({
  	type: DataType.UUID,
  	allowNull: false,
  })
  	fileStorageId!: string;

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

  @BelongsTo(() => FileStorage)
  	fileStorage!: FileStorage;
}
