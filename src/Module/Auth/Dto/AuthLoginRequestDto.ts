import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

export class AuthLoginRequestDto {
  @ApiProperty({
    default: 'safarishahim@gmail.com'
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    default: '12345678'
  })
  @IsNotEmpty()
  password: string;
}
