import { ApiProperty } from '@nestjs/swagger';
import { UserLogoDto } from './UserLogoDto';

export class UserMenuItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createDateTime: Date;

  @ApiProperty()
  updateDateTime: Date;

  @ApiProperty()
  userLogo: UserLogoDto;
}
