import { ApiProperty } from '@nestjs/swagger';
import { UserIdDto } from '../../User/Dto/UserIdDto';

export class UserFileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  fileSize: number;

  @ApiProperty()
  fileType: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  createDateTime: string;

  @ApiProperty()
  updateDateTime: string;

  @ApiProperty()
  user: UserIdDto;
}
