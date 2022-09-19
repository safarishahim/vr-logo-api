import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserFactory } from './Helper/user.factory';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService, UserFactory],
  providers: [UserService, UserFactory],
  controllers: [UserController],
})
export class UserModule {}
