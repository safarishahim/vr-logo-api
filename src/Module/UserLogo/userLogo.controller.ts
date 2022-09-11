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
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
  Version,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { AppApiResponse } from '../App/Dto/AppApiResponse';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AppApiPaginatedResponse } from '../App/Dto/AppApiPaginatedResponse';
import { PaginatedDto } from '../App/Dto/PaginatedDto';
import { PaginateQueryReq } from '../App/Dto/PaginateQueryReq';
import { UserLogo } from './userLogo.entity';
import { UserLogoService } from './userLogo.service';
import { UserLogoUpdateRequestDto } from './Dto/UserLogoUpdateRequestDto';
import { UserLogoCreateRequestDto } from './Dto/UserLogoCreateRequestDto';
import { UserService } from '../User/user.service';
import { UserLogoDto } from './Dto/UserLogoDto';
import { UserFileService } from '../UserFile/userFile.service';
import { UserFactory } from '../User/Helper/user.factory';
import { UserMenuDto } from './Dto/UserMenuDto';
import { UserMenuService } from './userMenu.service';
import { UserMenuUpdateRequestDto } from './Dto/UserMenuUpdateRequestDto';
import { UserMenuCreateRequestDto } from './Dto/UserMenuCreateRequestDto';
import { UserMenu } from './userMenu.entity';

@ApiTags('userLogo')
@Controller({
  version: '1',
  path: 'user-logo',
})
@ApiExtraModels(UserLogoDto, PaginatedDto)
export class UserLogoController {
  constructor(
    private userLogoService: UserLogoService,
    private userService: UserService,
    private userFileService: UserFileService,
    private userMenuService: UserMenuService,
    private userFactory: UserFactory,
  ) {}

  @Version('1')
  @ApiBearerAuth()
  @AppApiResponse(UserLogoDto)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: number, @Res() res: Response) {
    const userLogo = await this.userLogoService.getById(id);
    if (!userLogo) {
      throw new NotFoundException({
        error: 'USER_LOGO_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return res.status(HttpStatus.OK).send({
      data: {
        ...userLogo,
        user: this.userFactory.prepareUserInfo(userLogo.user),
        userFile: {
          ...userLogo.userFile,
          path: userLogo.userFile.path.replace(`files\\`, ''),
        },
      },
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @AppApiResponse(UserMenuDto)
  @UseGuards(JwtAuthGuard)
  @Get(':id/user-menu')
  async getMenu(@Param('id') id: number, @Res() res: Response) {
    const userLogo = await this.userLogoService.getById(id);
    if (!userLogo) {
      throw new NotFoundException({
        error: 'USER_LOGO_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const userMenu = await this.userMenuService.getByLogoId(userLogo.id);

    if (!userMenu) {
      throw new NotFoundException({
        error: 'USER_MENU_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return res.status(HttpStatus.OK).send({
      data: userMenu,
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @ApiQuery({ type: PaginateQueryReq })
  @AppApiPaginatedResponse(UserLogoDto)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Paginate() query: PaginateQuery, @Res() res: Response) {
    const userLogoPaginated = await this.userLogoService.findAll(query);

    return res.status(HttpStatus.OK).send({
      data: userLogoPaginated.data.map((item) => ({
        ...item,
        userFile: {
          ...item.userFile,
          path: item.userFile.path.replace(`files\\`, ''),
        },
      })),
      meta: userLogoPaginated.meta,
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @AppApiResponse(UserLogoDto)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Res() res: Response,
    @Req() req,
    @Body() requestDto: UserLogoUpdateRequestDto,
  ) {
    const userLogo = await this.userLogoService.getById(id);
    if (!userLogo) {
      throw new NotFoundException({
        error: 'USER_LOGO_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const userFile = await this.userFileService.getById(requestDto.userFileId);
    if (!userFile) {
      throw new UnprocessableEntityException({
        error: 'USER_FILE_NOT_FOUND',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    userLogo.title = requestDto.title;
    userLogo.userFile = userFile;

    const result = await this.userLogoService.update(userLogo.id, userLogo);

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: 'UPDATE_FAILED',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return res.status(HttpStatus.OK).send({
      data: {
        ...userLogo,
        userFile: {
          ...userLogo.userFile,
          path: userLogo.userFile.path.replace(`files\\`, ''),
        },
        user: this.userFactory.prepareUserIdInfo(userLogo.user),
      },
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @AppApiResponse(UserLogoDto)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Res() res: Response,
    @Req() req,
    @Body() requestDto: UserLogoCreateRequestDto,
  ) {
    const user = await this.userService.getById(req.userId);
    if (!user) {
      throw new UnauthorizedException({
        error: 'UNAUTHORIZED',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    const userFile = await this.userFileService.getById(requestDto.userFileId);
    if (!userFile) {
      throw new UnprocessableEntityException({
        error: 'USER_FILE_NOT_FOUND',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const userLogo = new UserLogo();
    userLogo.title = requestDto.title;
    userLogo.userFile = userFile;
    userLogo.user = user;
    userLogo.actionType = requestDto.actionType;

    const result = await this.userLogoService.create(userLogo);

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: 'CREATE_FAILED',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return res.status(HttpStatus.CREATED).send({
      data: {
        ...userLogo,
        userFile: {
          ...userLogo.userFile,
          path: userLogo.userFile.path.replace(`files\\`, ''),
        },
        user: this.userFactory.prepareUserIdInfo(userLogo.user),
      },
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    const userLogo = await this.userLogoService.getById(id);
    if (!userLogo) {
      throw new NotFoundException({
        error: 'USER_LOGO_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const result = await this.userLogoService.delete(userLogo.id);

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: 'DELETE_FAILED',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return res.status(HttpStatus.OK).send();
  }

  @Version('1')
  @ApiBearerAuth()
  @AppApiResponse(UserMenuDto)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/user-menu/:userMenuId')
  async updateMenu(
    @Param('id') logoId: number,
    @Param('userMenuId') id: number,
    @Res() res: Response,
    @Req() req,
    @Body() requestDto: UserMenuUpdateRequestDto,
  ) {
    const userMenu = await this.userMenuService.getById(id);
    if (!userMenu) {
      throw new NotFoundException({
        error: 'USER_MENU_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const userLogo = await this.userLogoService.getById(logoId);
    if (!userLogo) {
      throw new UnprocessableEntityException({
        error: 'USER_LOGO_NOT_FOUND',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    userMenu.title = requestDto.title;
    userMenu.userLogo = userLogo;

    const result = await this.userMenuService.update(userMenu.id, userMenu);

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: 'UPDATE_FAILED',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return res.status(HttpStatus.OK).send({
      data: userMenu,
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @AppApiResponse(UserMenuDto)
  @UseGuards(JwtAuthGuard)
  @Post(':id/user-menu')
  async createMenu(
    @Res() res: Response,
    @Req() req,
    @Body() requestDto: UserMenuCreateRequestDto,
    @Param('userMenuId') id: number,
  ) {
    const userLogo = await this.userLogoService.getById(id);
    if (!userLogo) {
      throw new UnprocessableEntityException({
        error: 'USER_LOGO_NOT_FOUND',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const userMenu = new UserMenu();
    userMenu.title = requestDto.title;
    userMenu.userLogo = userLogo;

    const result = await this.userMenuService.create(userMenu);

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: 'CREATE_FAILED',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return res.status(HttpStatus.CREATED).send({
      data: {
        ...userMenu,
        userLogo: {
          ...userMenu.userLogo,
          userFile: {
            ...userMenu.userLogo.userFile,
            path: userMenu.userLogo.userFile.path.replace(`files\\`, ''),
          },
        },
      },
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/user-menu/:userMenuId')
  async deleteMenu(@Param('userMenuId') id: number, @Res() res: Response) {
    const userMenu = await this.userMenuService.getById(id);
    if (!userMenu) {
      throw new NotFoundException({
        error: 'USER_MENU_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const result = await this.userMenuService.delete(userMenu.id);

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: 'DELETE_FAILED',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return res.status(HttpStatus.OK).send();
  }
}
