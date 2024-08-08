import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaClient } from '@prisma/client';
import { CartProductModule } from '../cartProduct/cart_product.module';
import { CartModule } from '../cart/cart.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [CartProductModule, CartModule, AuthModule, UsersModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaClient, PrismaService],
  exports: [PaymentService],
})
export class PaymentModule {}
