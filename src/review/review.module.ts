import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { OrderModule } from 'src/order-product/order.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [AuthModule, UsersModule, OrderModule],
  controllers: [ReviewController],
  providers: [ReviewService, PrismaClient],
})
export class ReviewModule {}
