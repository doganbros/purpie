import 'isomorphic-fetch';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { Logger, ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import { initApp } from 'populators/init-app';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

initApp();

const { REACT_APP_CLIENT_HOST } = process.env;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  app.enableVersioning();
  app.use(helmet());
  app.enableCors({
    origin: new RegExp(
      `(\\b|\\.)${new URL(REACT_APP_CLIENT_HOST as string).host.replace(
        /\./g,
        '\\.',
      )}$`,
    ),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  app.use(cookieParser());
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const logger = new Logger('Main');

  const { SERVER_PORT = 8000 } = process.env;

  const config = new DocumentBuilder()
    .setTitle('Octopus')
    .setDescription('Octopus API Documentation')
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
