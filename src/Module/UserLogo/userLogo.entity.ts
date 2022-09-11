import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../User/user.entity';
import { UserFile } from '../UserFile/userFile.entity';
import { JoinColumn } from 'typeorm';
import { ActionTypeEnum } from './Enum/action-type.enum';
import { UserMenu } from './userMenu.entity';

@Entity()
export class UserLogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ActionTypeEnum,
    default: ActionTypeEnum.MENU,
  })
  actionType: string;

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

  @ManyToOne(() => UserFile)
  @JoinColumn()
  userFile: UserFile;

  @OneToOne(() => UserMenu, (userMenu) => userMenu.userLogo)
  userMenu: UserMenu;
}
