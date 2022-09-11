import { ApiProperty } from '@nestjs/swagger';
import { UserMenuItemIdDto } from '../../UserLogo/Dto/UserMenuItemIdDto';

export class GalleryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userMenuItem: UserMenuItemIdDto;

  @ApiProperty()
  createDateTime: Date;

  @ApiProperty()
  updateDateTime: Date;
}
