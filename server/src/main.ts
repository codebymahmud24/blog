import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  ConfigModule.forRoot({ isGlobal: true });

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Only keep properties that are defined in the DTO
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
