import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from 'ormconfig';
import { AuthModule } from './auth/auth.module';
import { TypeOrmExceptionFilter } from './typeorm-exception.filter';
import { MailModule } from './mail/mail.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { ZoneModule } from './zone/zone.module';
import { UtilsModule } from './utils/utils.module';
import { PaginationMiddleware } from './utils/middlewares/paginate.middleware';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    AuthModule,
    MailModule,
    ZoneModule,
    UtilsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TypeOrmExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
