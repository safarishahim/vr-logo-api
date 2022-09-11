import { NestFactory } from '@nestjs/core';
import { AppModule } from './Module/App/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  const openApiConfig = new DocumentBuilder()
    .setTitle('VR Logo')
    .setDescription('the api endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.get<number>('PORT'));
}

bootstrap();
