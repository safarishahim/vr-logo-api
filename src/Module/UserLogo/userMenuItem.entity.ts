import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserFile } from '../UserFile/userFile.entity';
import { UserMenu } from './userMenu.entity';
import { ActionTypeEnum } from './Enum/action-type.enum';
import { Gallery } from '../Gallery/Gallery.entity';

@Entity()
export class UserMenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: () => '-1',
  })
  parentId: number;

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

  @ManyToOne(() => UserFile)
  @JoinColumn()
  userFile: UserFile;

  @ManyToOne(() => UserMenu, (item) => item.userMenuItems)
  userMenu: UserMenu;

  @Column({
    type: 'enum',
    enum: ActionTypeEnum,
    default: ActionTypeEnum.MENU,
  })
  actionType: string;

  @Column()
  actionTypeId: number;

  @Column({
    nullable: true,
    default: null,
  })
  actionTypeLink: string;

  @OneToOne(() => Gallery, (item) => item.userMenuItem)
  gallery: Gallery;
}
