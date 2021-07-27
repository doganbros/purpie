import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from 'ormconfig';
import { AuthModule } from './auth/auth.module';
import { TypeOrmExceptionFilter } from './utils/exceptions/typeorm.exception';
import { MailModule } from './mail/mail.module';
import { ZoneModule } from './zone/zone.module';
import { UtilsModule } from './utils/utils.module';
import { PaginationMiddleware } from './utils/middlewares/paginate.middleware';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    AuthModule,
    MailModule,
    ZoneModule,
    UtilsModule,
    UserModule,
    ChannelModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TypeOrmExceptionFilter,
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
