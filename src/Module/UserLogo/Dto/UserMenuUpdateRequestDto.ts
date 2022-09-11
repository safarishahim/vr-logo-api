import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserMenuUpdateRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}
