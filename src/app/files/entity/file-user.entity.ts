import { Entity, Column, JoinColumn, ManyToOne, } from 'typeorm';
import { AbstractEntity, } from 'app/database/AbstractEntity';
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
	})
		public: boolean;

	@ManyToOne(() => File)
	@JoinColumn({
		foreignKeyConstraintName: 'FileUsers_fileId_fkey',
	})
		file!: File;
}
