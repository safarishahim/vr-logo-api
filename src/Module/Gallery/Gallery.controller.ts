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
import { GalleryService } from './Gallery.service';
import { GalleryUpdateRequestDto } from './Dto/GalleryUpdateRequestDto';
import { UserMenuItemService } from '../UserLogo/userMenuItem.service';
import { GalleryCreateRequestDto } from './Dto/GalleryCreateRequestDto';
import { Gallery } from './Gallery.entity';
import { GalleryDto } from './Dto/GalleryDto';
import { GalleryItemDto } from './Dto/GalleryItemDto';
import { GalleryItemService } from './GalleryItem.service';
import { GalleryItemCreateRequestDto } from './Dto/GalleryItemCreateRequestDto';
import { GalleryItem } from './GalleryItem.entity';
import { UserFileService } from '../UserFile/userFile.service';

@ApiTags('gallery')
@Controller({
  version: '1',
  path: 'gallery',
})
@ApiExtraModels(PaginatedDto, GalleryDto, GalleryItemDto)
export class GalleryController {
  constructor(
    private galleryService: GalleryService,
    private userMenuItemService: UserMenuItemService,
    private galleryItemService: GalleryItemService,
    private userFileService: UserFileService,
  ) {}

  @Version('1')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @AppApiResponse(GalleryDto)
  @Get(':id')
  async get(@Param('id') id: number, @Res() res: Response) {
    const gallery = await this.galleryService.getById(id);
    if (!gallery) {
      throw new NotFoundException({
        error: 'GALLERY_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return res.status(HttpStatus.OK).send({
      data: gallery,
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @ApiQuery({ type: PaginateQueryReq })
  @AppApiPaginatedResponse(GalleryDto)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Paginate() query: PaginateQuery, @Res() res: Response) {
    const galleryPaginated = await this.galleryService.findAll(query);

    return res.status(HttpStatus.OK).send({
      data: galleryPaginated.data,
      meta: galleryPaginated.meta,
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @AppApiResponse(GalleryDto)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Res() res: Response,
    @Req() req,
    @Body() requestDto: GalleryUpdateRequestDto,
  ) {
    const gallery = await this.galleryService.getById(id);
    if (!gallery) {
      throw new NotFoundException({
        error: 'GALLEY_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const userMenuItem = await this.userMenuItemService.get(
      requestDto.userMenuItemId,
    );
    if (!userMenuItem) {
      throw new UnprocessableEntityException({
        error: 'USER_MENU_ITEM_NOT_FOUND',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    gallery.userMenuItem = userMenuItem;

    const result = await this.galleryService.update(gallery.id, gallery);

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: 'UPDATE_FAILED',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return res.status(HttpStatus.OK).send({
      data: gallery,
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @AppApiResponse(GalleryDto)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Res() res: Response,
    @Req() req,
    @Body() requestDto: GalleryCreateRequestDto,
  ) {
    const userMenuItem = await this.userMenuItemService.get(
      requestDto.userMenuItemId,
    );
    if (!userMenuItem) {
      throw new UnprocessableEntityException({
        error: 'USER_MENU_ITEM_NOT_FOUND',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const gallery = new Gallery();
    gallery.userMenuItem = userMenuItem;

    const result = await this.galleryService.create(gallery);

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: 'CREATE_FAILED',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return res.status(HttpStatus.CREATED).send({
      data: gallery,
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    const gallery = await this.galleryService.getById(id);
    if (!gallery) {
      throw new NotFoundException({
        error: 'GALLERY_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const result = await this.galleryService.delete(gallery.id);

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
  @UseGuards(JwtAuthGuard)
  @AppApiResponse(GalleryItemDto)
  @Get(':galleryId/items/:menuItemId')
  async getItem(@Param('menuItemId') id: number, @Res() res: Response) {
    const galleryItem = await this.galleryItemService.get(id);
    if (!galleryItem) {
      throw new NotFoundException({
        error: 'GALLERY_ITEM_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return res.status(HttpStatus.OK).send({
      data: galleryItem,
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':galleryId/items/:menuItemId')
  async deleteItem(@Param('menuItemId') id: number, @Res() res: Response) {
    const galleryItem = await this.galleryItemService.get(id);
    if (!galleryItem) {
      throw new NotFoundException({
        error: 'GALLERY_ITEM_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const result = await this.galleryItemService.delete(id);

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
  @AppApiResponse(GalleryItemDto)
  @UseGuards(JwtAuthGuard)
  @Post(':galleryId/items')
  async createItem(
    @Res() res: Response,
    @Req() req,
    @Body() requestDto: GalleryItemCreateRequestDto,
    @Param('galleryId') galleryId: number,
  ) {
    const gallery = await this.galleryService.getById(galleryId);
    if (!gallery) {
      throw new UnprocessableEntityException({
        error: 'GALLERY_NOT_FOUND',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const userFile = await this.userFileService.getById(requestDto.userFileId);
    if (!userFile) {
      throw new UnprocessableEntityException({
        error: 'USER_FILE_NOT_FOUND',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const galleryItem = new GalleryItem();
    galleryItem.gallery = gallery;
    galleryItem.userFile = userFile;

    const result = await this.galleryItemService.create(galleryItem);

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: 'CREATE_FAILED',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return res.status(HttpStatus.CREATED).send({
      data: galleryItem,
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @AppApiResponse(GalleryItemDto)
  @UseGuards(JwtAuthGuard)
  @Patch(':galleryId/items/:menuItemId')
  async updateItem(
    @Param('menuItemId') id: number,
    @Param('galleryId') galleryId: number,
    @Res() res: Response,
  ) {
    const galleryItem = await this.galleryItemService.get(id);
    if (!galleryItem) {
      throw new NotFoundException({
        error: 'GALLERY_ITEM_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const gallery = await this.galleryService.getById(galleryId);
    if (!gallery) {
      throw new UnprocessableEntityException({
        error: 'GALLERY_NOT_FOUND',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    galleryItem.gallery = gallery;

    const result = await this.galleryItemService.update(
      galleryItem.id,
      galleryItem,
    );

    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: 'UPDATE_FAILED',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return res.status(HttpStatus.OK).send({
      data: galleryItem,
    });
  }
}
