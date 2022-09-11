import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ActionTypeEnum } from '../Enum/action-type.enum';

export class UserLogoCreateRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  userFileId: string;

  @IsEnum(ActionTypeEnum)
  @ApiProperty()
  actionType: ActionTypeEnum;
}
