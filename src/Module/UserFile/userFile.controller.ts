import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { PaginatedDto } from '../App/Dto/PaginatedDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppApiResponse } from '../App/Dto/AppApiResponse';
import { UserFileDto } from './Dto/UserFileDto';
import { UserFileService } from './userFile.service';
import { UserFile } from './userFile.entity';
import { UserService } from '../User/user.service';
import { Response } from 'express';

@ApiTags('userFile')
@Controller({
  version: '1',
  path: 'user-file',
})
@ApiExtraModels(PaginatedDto, UserFileDto)
export class UserFileController {
  constructor(
    private userFileService: UserFileService,
    private userService: UserService,
  ) {}

  @Version('1')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @AppApiResponse(UserFileDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Req() req,
  ) {
    const user = await this.userService.getById(req.userId);
    if (!user) {
      throw new UnauthorizedException({
        error: 'UNAUTHORIZED',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    const userFileModel = new UserFile();
    userFileModel.fileName = file.originalname;
    userFileModel.fileSize = file.size;
    userFileModel.path = file.path;
    userFileModel.fileType = file.mimetype;
    userFileModel.user = user;

    const result = await this.userFileService.create(userFileModel);
    if (result.raw.affectedRows === 0) {
      throw new InternalServerErrorException({
        error: 'CREATE_FAILED',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return res.status(HttpStatus.CREATED).send({
      data: {
        ...userFileModel,
        path: userFileModel.path.replace(`files\\`, ''),
        user: {
          id: user.id,
        },
      },
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @AppApiResponse(null)
  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string, @Req() req, @Res() res) {
    const userFile = await this.userFileService.getById(fileId);
    if (!userFile) {
      throw new NotFoundException({
        error: 'FILE_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const result = await this.userFileService.deleteFile(userFile.id);
    if (!result.affected) {
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
  @AppApiResponse(UserFileDto)
  @Get(':fileId')
  async getFile(@Param('fileId') fileId: string, @Req() req, @Res() res) {
    const userFile = await this.userFileService.getById(fileId);
    if (!userFile) {
      throw new NotFoundException({
        error: 'FILE_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return res.status(HttpStatus.OK).send({
      data: {
        ...userFile,
        path: userFile.path.replace(`files\\`, ''),
        user: {
          id: userFile.id,
        },
      },
    });
  }

  @Version('1')
  @ApiBearerAuth()
  @Get('/download/:filePath')
  async download(@Param('filePath') path: string, @Res() response) {
    return response.sendFile(path, { root: './files' });
  }
}
