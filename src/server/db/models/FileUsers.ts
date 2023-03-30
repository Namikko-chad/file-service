import {
	Column,
	DataType,
	Table,
	Scopes,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript';
import { fn, } from 'sequelize';
import { File, } from './File';
import { AbstractModel, } from './abstract/AbstractModel';

@Scopes(() => ({
	defaultScope: {
		attributes: {
			exclude: ['createdAt', 'updatedAt'],
		},
	},
}))
@Table({})
export class FileUser extends AbstractModel {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		unique: true,
		defaultValue: fn('uuid_generate_v4'),
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

	@Column({
		type: DataType.DATE,
		defaultValue: fn('now'),
	})
	override createdAt?: Date;

	@Column({
		type: DataType.DATE,
		defaultValue: fn('now'),
	})
	override updatedAt?: Date;

	@BelongsTo(() => File)
		file!: File;
}
