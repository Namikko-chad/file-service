import { Column, DataType, Model, Table, Scopes, } from 'sequelize-typescript';
import { getUUID, } from '../utils/index';

export enum Storage {
  FOLDER = 'folder',
  DB = 'db',
}

@Scopes(() => ({
	defaultScope: {
		attributes: {
			exclude: ['data', 'createdAt', 'updatedAt'],
		},
	},
	withData: {
		attributes: {
			include: ['data'],
		},
	},
}))
@Table({})
export class FileStorage extends Model {
  @Column({
  	type: DataType.UUID,
  	primaryKey: true,
  	unique: true,
  	defaultValue: () => getUUID(),
  })
	override id!: string;

  @Column({
  	type: DataType.STRING(10),
  	allowNull: false,
  })
  	ext!: string;

  @Column({
  	type: DataType.STRING,
  	allowNull: false,
  })
  	mime!: string;

  @Column({
  	type: DataType.STRING,
  	defaultValue: Storage.DB,
  })
  	storage!: Storage;

  @Column({
  	type: DataType.STRING(),
  	allowNull: false,
  })
  	hash!: string;

  @Column({
  	type: DataType.BLOB,
  })
  	data?: Buffer;
}
