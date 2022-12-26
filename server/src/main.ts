import 'isomorphic-fetch';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { Logger, ValidationPipe } from '@nestjs/common';
import { initApp } from 'populators/init-app';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import cors from 'cors';
import { AppModule } from './app.module';

initApp();

const { HTTP_MAX_BODY_SIZE } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  app.enableVersioning();
  app.use(helmet());
  app.use(json({ limit: HTTP_MAX_BODY_SIZE || '500mb' }));

  const corsOptions = {
    origin: true,
    credentials: true,
    preflightContinue: false,
  };

  app.use(cors(corsOptions));
  app.enableCors(corsOptions);
  app.use(cookieParser());
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Global Exception Handler for non handled errors
  // app.useGlobalFilters(new GlobalExceptionHandler());

  const logger = new Logger('Main');

  const { SERVER_PORT = 8000 } = process.env;

  const config = new DocumentBuilder()
    .setTitle('Purpie')
    .setDescription('Purpie API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app
    .listen(SERVER_PORT)
    .then(() => logger.log(`Server started on port ${SERVER_PORT}`));
}

bootstrap();
