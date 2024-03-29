import path from 'path';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventEmitterModule } from '@nestjs/event-emitter';
import ormConfig from 'ormconfig';
import { AuthModule } from './auth/auth.module';
import { TypeOrmExceptionFilter } from './utils/exceptions/typeorm.exception';
import { MailModule } from './mail/mail.module';
import { ZoneModule } from './zone/zone.module';
import { UtilsModule } from './utils/utils.module';
import { PaginationMiddleware } from './utils/middlewares/paginate.middleware';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { MeetingModule } from './meeting/meeting.module';
import { ActivityModule } from './activity/activity.module';
import { StreamModule } from './stream/stream.module';
import { VideoModule } from './video/video.module';
import { PostModule } from './post/post.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';
import { ResponseCodeMiddleware } from './utils/middlewares/response-code.middleware';
import { UserLogModule } from './log/user-log.module';
import { LoggerMiddleware } from './utils/middlewares/logger.middleware';
import { MembershipModule } from './membership/membership.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot(ormConfig),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', '..', 'src', 'assets'),
      serveRoot: '/static-dir',
      serveStaticOptions: {
        index: false,
      },
    }),
    AuthModule,
    MailModule,
    ZoneModule,
    UtilsModule,
    UserModule,
    ChannelModule,
    MeetingModule,
    ActivityModule,
    StreamModule,
    VideoModule,
    PostModule,
    ChatModule,
    NotificationModule,
    UserLogModule,
    MembershipModule,
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

    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*/post/list/feed*',
      method: RequestMethod.GET,
    });

    consumer
      .apply(ResponseCodeMiddleware)
      .forRoutes({ path: '*/auth/client/*', method: RequestMethod.POST });
  }
}
