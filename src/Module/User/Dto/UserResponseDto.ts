import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../Enum/user-status.enum';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    enum: UserStatus,
  })
  status: UserStatus;

  @ApiProperty()
  createDateTime: string;

  @ApiProperty()
  updateDateTime: string;
}
