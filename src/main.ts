import { join } from 'path';
import { fastifyStatic } from '@fastify/static';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create (
    AppModule,
    //new FastifyAdapter(),
  );



  const logger = new Logger('bootstrap');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // como habilito el cors
  app.enableCors();

  await app.listen(process.env.PORT);
  logger.log(`Application listening on port ${process.env.PORT}`);
}

bootstrap();