import { ApiProperty } from '@nestjs/swagger';
import { EntityIdDto } from '../../App/Dto/EntityIdDto';
import { UserFileDto } from '../../UserFile/Dto/UserFileDto';

export class GalleryItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  parent: GalleryItemDto;

  @ApiProperty()
  children: GalleryItemDto[];

  @ApiProperty()
  gallery: EntityIdDto;

  @ApiProperty()
  userFileDto: UserFileDto;

  @ApiProperty()
  createDateTime: Date;

  @ApiProperty()
  updateDateTime: Date;
}
