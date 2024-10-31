import { Module  } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaClient } from '@prisma/client';
import { CartProductModule } from '../cartProduct/cart_product.module';
import { CartModule } from '../cart/cart.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../database/prisma.service';
import { ProductModule } from 'src/Products/Products.module';
import { CorreiosModule } from 'src/correios/correios.module';

@Module({
  imports: [CartProductModule, CartModule, AuthModule, UsersModule, ProductModule, CorreiosModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaClient, PrismaService],
  exports: [PaymentService],
})
export class PaymentModule {}
