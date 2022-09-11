import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GalleryCreateRequestDto {
  @IsNumber()
  @ApiProperty()
  userMenuItemId: number;
}
