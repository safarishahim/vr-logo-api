import { ApiProperty } from '@nestjs/swagger';

export class UserMenuDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createDateTime: Date;

  @ApiProperty()
  updateDateTime: Date;
}
