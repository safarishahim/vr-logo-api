import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from './Gallery.entity';
import { GalleryItem } from './GalleryItem.entity';
import { GalleryService } from './Gallery.service';
import { GalleryController } from './Gallery.controller';
import { UserLogoModule } from '../UserLogo/userLogo.module';
import { GalleryItemService } from './GalleryItem.service';
import { UserFileModule } from '../UserFile/userFile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gallery]),
    TypeOrmModule.forFeature([GalleryItem]),
    UserLogoModule,
    UserFileModule,
  ],
  exports: [GalleryService, GalleryItemService],
  providers: [GalleryService, GalleryItemService],
  controllers: [GalleryController],
})
export class GalleryModule {}
