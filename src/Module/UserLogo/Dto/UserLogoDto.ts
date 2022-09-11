import { ApiProperty } from '@nestjs/swagger';
import { UserFileDto } from '../../UserFile/Dto/UserFileDto';
import { UserIdDto } from '../../User/Dto/UserIdDto';

export class UserLogoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createDateTime: Date;

  @ApiProperty()
  updateDateTime: Date;

  @ApiProperty()
  user: UserIdDto;

  @ApiProperty()
  userFile: UserFileDto;
}
