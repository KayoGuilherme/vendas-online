import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ProductController } from './Products.controller';
import { ProductService } from './Products.service';
import { PrismaModule } from '../database/prisma.module';
import { PrismaClient } from '@prisma/client';
import { FileModule } from '../file/file.module';
import { CorreiosModule } from 'src/correios/correios.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => UsersModule),
    PrismaModule,
    FileModule,
    CorreiosModule
  ],
  controllers: [ProductController],
  providers: [ProductService, PrismaClient],
  exports: [ProductService, ProductModule],
})
export class ProductModule {}
