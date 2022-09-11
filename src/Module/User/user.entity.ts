import {
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStatus } from './Enum/user-status.enum';
import { UserLogo } from '../UserLogo/userLogo.entity';
import { UserFile } from '../UserFile/userFile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.CREATED,
  })
  status: string;

  @Column()
  password: string;

  @Column()
  salt: string;

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

  @OneToMany(() => UserLogo, (userLogo) => userLogo.user)
  userLogos: UserLogo[];

  @OneToMany(() => UserFile, (userFile) => userFile.user)
  userFile: UserFile[];
}
