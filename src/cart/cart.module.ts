import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CartProductModule } from '../cartProduct/cart_product.module';

@Module({
  imports: [AuthModule, UsersModule, CartProductModule],
  providers: [CartService, PrismaClient],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
