import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnprocessableEntityException,
  UseGuards,
  Version
} from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiExtraModels, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../Auth/jwt-auth.guard";
import { DataSource } from "typeorm";
import { UserFactory } from "./Helper/user.factory";
import { UserUpdateRequestDto } from "./Dto/UserUpdateRequestDto";
import * as bcrypt from "bcryptjs";
import { User } from "./user.entity";
import { UserCreateRequestDto } from "./Dto/UserCreateRequestDto";
import { UserResponseDto } from "./Dto/UserResponseDto";
import { AppApiResponse } from "../App/Dto/AppApiResponse";
import { Paginate, PaginateQuery } from "nestjs-paginate";
import { AppApiPaginatedResponse } from "../App/Dto/AppApiPaginatedResponse";
import { PaginatedDto } from "../App/Dto/PaginatedDto";
import { PaginateQueryReq } from "../App/Dto/PaginateQueryReq";


@ApiTags("user")
@Controller({
  version: "1",
  path: "user"
})
@ApiExtraModels(UserResponseDto, PaginatedDto)
export class UserController {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private dataSource: DataSource,
    private userFactory: UserFactory
  ) {
  }

  @Version("1")
  @ApiBearerAuth()
  @AppApiResponse(UserResponseDto)
  @UseGuards(JwtAuthGuard)
  @Get("current")
  async getCurrent(@Res() res: Response, @Req() req) {
    const user = await this.userService.getById(req.userId);
    if (!user) {
      throw new NotFoundException({
        error: "USER_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    return res
      .status(HttpStatus.OK)
      .send({
        data: this.userFactory.prepareUserInfo(user)
      });
  }

  @Version("1")
  @ApiBearerAuth()
  @AppApiResponse(UserResponseDto)
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async get(
    @Param("id") id: number,
    @Res() res: Response
  ) {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException({
        error: "USER_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    return res
      .status(HttpStatus.OK)
      .send({
        data: this.userFactory.prepareUserInfo(user)
      });
  }

  @Version("1")
  @ApiBearerAuth()
  @ApiQuery({ type: PaginateQueryReq, })
  @AppApiPaginatedResponse(UserResponseDto)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Paginate() query: PaginateQuery,
    @Res() res: Response
  ) {
    const users = await this.userService.findAll(query);


    return res
      .status(HttpStatus.OK)
      .send({
        data: users.data,
        meta: users.meta,
      });
  }


  @Version("1")
  @ApiBearerAuth()
  @AppApiResponse(UserResponseDto)
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Res() res: Response,
    @Req() req,
    @Body() requestDto: UserUpdateRequestDto
  ) {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException({
        error: "USER_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    user.firstName = requestDto.firstName;
    user.lastName = requestDto.lastName;
    user.email = requestDto.email;
    if (requestDto.password) {
      user.password = bcrypt.hashSync(requestDto.password, bcrypt.genSaltSync());
    }

    const result = await this.userService.update(user.id, user);

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: "UPDATE_FAILED",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }

    return res
      .status(HttpStatus.OK)
      .send({
        data: this.userFactory.prepareUserInfo(user)
      });
  }

  @Version("1")
  @ApiBearerAuth()
  @AppApiResponse(UserResponseDto)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Res() res: Response,
    @Body() requestDto: UserCreateRequestDto
  ) {
    if (await this.userService.getByEmail(requestDto.email)) {
      throw new UnprocessableEntityException({
        error: "USER_EXIST",
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY
      });
    }

    const user = new User();
    user.firstName = requestDto.firstName;
    user.lastName = requestDto.lastName;
    user.email = requestDto.email;
    user.salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(requestDto.password, user.salt);

    const result = await this.userService.create(user);

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: "CREATE_FAILED",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }

    return res
      .status(HttpStatus.CREATED)
      .send({
        data: this.userFactory.prepareUserInfo(user)
      });
  }

  @Version("1")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(
    @Param("id") id: number,
    @Res() res: Response
  ) {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException({
        error: "USER_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    const result = await this.userService.delete(user.id);

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: "DELETE_FAILED",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }


    return res
      .status(HttpStatus.OK);
  }
}
