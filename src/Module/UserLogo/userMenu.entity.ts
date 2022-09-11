import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserLogo } from './userLogo.entity';
import { UserMenuItem } from './userMenuItem.entity';

@Entity()
export class UserMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

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

  @OneToOne(() => UserLogo, (userLogo) => userLogo.userMenu)
  @JoinColumn()
  userLogo: UserLogo;

  @OneToMany(() => UserMenuItem, (userLogo) => userLogo.userMenu)
  userMenuItems: UserMenuItem[];
}
