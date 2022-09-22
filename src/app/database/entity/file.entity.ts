import { StorageType, } from 'app/storages';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
} from 'typeorm';

import { v4 as uuidv4, } from 'uuid';

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

  @Column()
  	mime!: string;

  @Column()
  	size!: number;

  @Column({
  	default: 'db',
  })
  	storage!: StorageType;

	@Column()
		hash!: string;

	@Column()
		data?: Buffer;
}
