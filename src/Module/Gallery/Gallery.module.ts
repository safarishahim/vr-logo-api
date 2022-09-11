import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from './Gallery.entity';
import { GalleryItem } from './GalleryItem.entity';
import { GalleryService } from './Gallery.service';
import { GalleryController } from './Gallery.controller';
import { UserLogoModule } from '../UserLogo/userLogo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gallery]),
    TypeOrmModule.forFeature([GalleryItem]),
    UserLogoModule,
  ],
  exports: [GalleryService],
  providers: [GalleryService],
  controllers: [GalleryController],
})
export class GalleryModule {}
