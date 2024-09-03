import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserIdCheckMiddleware } from '../middlewares/user-id-check.middlewares';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../database/prisma.module';
import { PrismaClient } from '@prisma/client';


@Module({
  imports: [forwardRef(() => AuthModule), PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaClient],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'users/:id',
      method: RequestMethod.ALL,
    });
  }
}
