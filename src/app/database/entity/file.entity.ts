import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	UpdateDateColumn,
	CreateDateColumn,
} from 'typeorm';
import { v4 as uuidv4, } from 'uuid';
import FileUser from './file-user.entity';

@Entity({
	name: 'Files',
})
export default class File {
	@PrimaryGeneratedColumn('uuid')
		id: string = uuidv4();

	@Column({
		length: 10,
	})
		ext!: string;

	@Column({
		length: 255,
	})
		mime!: string;

	@Column({
		type: 'bigint',
	})
		size!: number;

	@Column({
		default: 'db',
		length: 255,
	})
		storage!: string;

	@Column({
		length: 255,
	})
		hash!: string;

	@Column({
		type: 'bytea',
		nullable: true,
		select: false,
	})
		data?: Buffer;

	@CreateDateColumn()
		createdAt!: Date;

	@UpdateDateColumn()
		updatedAt!: Date;

	@OneToMany(() => FileUser, (fileUser) => fileUser.userId)
		fileUsers?: FileUser[];
}
