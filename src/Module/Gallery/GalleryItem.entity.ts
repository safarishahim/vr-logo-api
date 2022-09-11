import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gallery } from './Gallery.entity';
import { UserFile } from '../UserFile/userFile.entity';

@Entity()
export class GalleryItem {
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

  @ManyToOne(() => Gallery, (item) => item.galleryItems)
  gallery: Gallery;

  @ManyToOne(() => UserFile)
  @JoinColumn()
  userFile: UserFile;
}
