import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserMenuCreateRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}
