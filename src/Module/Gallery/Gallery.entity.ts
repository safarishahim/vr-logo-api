import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserMenuItem } from '../UserLogo/userMenuItem.entity';
import { GalleryItem } from './GalleryItem.entity';

@Entity()
export class Gallery {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToOne(() => UserMenuItem, (item) => item.gallery)
  @JoinColumn()
  userMenuItem: UserMenuItem;

  @OneToMany(() => GalleryItem, (item) => item.gallery)
  galleryItems: GalleryItem[];
}
