import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFile } from './userFile.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { UserFileController } from './userFile.controller';
import { UserFileService } from './userFile.service';
import { UserModule } from '../User/user.module';

@Module({
  exports: [UserFileService],
  imports: [
    TypeOrmModule.forFeature([UserFile]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const storages = {
          local: () =>
            diskStorage({
              destination: './files',
              filename: (request, file, callback) => {
                callback(
                  null,
                  `${randomUUID()}.${file.originalname
                    .split('.')
                    .pop()
                    .toLowerCase()}`,
                );
              },
            }),
        };

        return {
          fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
              return callback(
                new HttpException(
                  {
                    error: 'CANT_UPLOAD',
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                  },
                  HttpStatus.UNPROCESSABLE_ENTITY,
                ),
                false,
              );
            }

            callback(null, true);
          },
          storage: storages.local(),
          limits: {
            fileSize: configService.get('MAX_FILE_SIZE'),
          },
        };
      },
    }),
    UserModule,
  ],
  providers: [UserFileService],
  controllers: [UserFileController],
})
export class UserFileModule {}
