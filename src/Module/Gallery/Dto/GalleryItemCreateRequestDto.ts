import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GalleryItemCreateRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  userFileId: string;
}
