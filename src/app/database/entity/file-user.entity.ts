import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

import { v4 as uuidv4, } from 'uuid';
import File from './file.entity';

@Entity({
	name: 'FileUsers',
})
export default class FileUser {
	@PrimaryGeneratedColumn('uuid')
		id: string = uuidv4();

	@Column({
		type: 'uuid',
	})
		userId: string;

	@ManyToOne(() => File)
	@JoinColumn()
		file!: File;

	@Column({
		length: 255,
	})
		name!: string;

	@Column({
		default: false,
	})
		public!: boolean;

	@CreateDateColumn()
		createdAt!: Date;

	@UpdateDateColumn()
		updatedAt!: Date;
}
