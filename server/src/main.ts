import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { loadEnv } from 'helpers/utils';
import { AppModule } from './app.module';

loadEnv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  app.enableVersioning();
  app.use(helmet());
  app.use(cors());
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const { PORT = 8000 } = process.env;

  const config = new DocumentBuilder()
    .setTitle('Octopus')
    .setDescription('Octopus API Documentation')
    .setVersion('1.0')
    .addServer('/v1/')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // eslint-disable-next-line no-console
  app.listen(PORT).then(() => console.log(`Server started on port ${PORT}`));
}
bootstrap();
