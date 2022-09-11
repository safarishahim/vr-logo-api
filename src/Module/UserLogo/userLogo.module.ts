import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLogo } from './userLogo.entity';
import { UserLogoService } from './userLogo.service';
import { UserModule } from '../User/user.module';
import { UserLogoController } from './userLogo.controller';
import { UserFileModule } from '../UserFile/userFile.module';
import { UserMenu } from './userMenu.entity';
import { UserMenuService } from './userMenu.service';
import { UserMenuItem } from './userMenuItem.entity';
import { UserMenuItemService } from './userMenuItem.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLogo]),
    TypeOrmModule.forFeature([UserMenu]),
    TypeOrmModule.forFeature([UserMenuItem]),
    UserModule,
    UserFileModule,
  ],
  exports: [UserLogoService, UserMenuService, UserMenuItemService],
  providers: [UserLogoService, UserMenuService, UserMenuItemService],
  controllers: [UserLogoController],
})
export class UserLogoModule {}
