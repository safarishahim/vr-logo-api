import { Body, Controller, HttpStatus, NotFoundException, Post, Res, Version } from "@nestjs/common";
import { Response } from "express";
import * as bcrypt from "bcryptjs";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../User/user.service";
import { AuthLoginRequestDto } from "./Dto/AuthLoginRequestDto";
import { AuthService } from "./auth.service";

@ApiTags("auth")
@Controller({
  version: "1",
  path: "auth"
})
export class AuthController {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private authService: AuthService
  ) {
  }

  @Version("1")
  @Post("login")
  async login(
    @Res() res: Response,
    @Body() { email, password }: AuthLoginRequestDto
  ) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new NotFoundException({
        error: "USER_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    if (bcrypt.hashSync(password, user.salt) !== user.password) {
      throw new NotFoundException({
        error: "USER_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    const { accessToken } = await this.authService.login(user);
    res.status(HttpStatus.CREATED).send({
      data: {
        accessToken,
        type: "Bearer"
      }
    });
  }

}
