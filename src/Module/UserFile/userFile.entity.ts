import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../User/user.entity';

@Entity()
export class UserFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  fileSize: number;

  @Column()
  fileType: string;

  @Column()
  path: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDateTime: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateDateTime: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updateDateTime = new Date();
  }

  @ManyToOne(() => User, (user) => user.userLogos)
  user: User;
}
