import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GalleryUpdateRequestDto {
  @IsNumber()
  @ApiProperty()
  userMenuItemId: number;
}
