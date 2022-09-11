import { ApiProperty } from '@nestjs/swagger';

export class UserUploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: any;
}
