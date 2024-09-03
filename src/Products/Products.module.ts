import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ProductController } from './Products.controller';
import { FileModule } from '../file/file.module';
import { CorreiosModule } from 'src/correios/correios.module';
import { FileService } from 'src/file/file.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { PrismaModule } from 'src/database/prisma.module';
import { ProductService } from './Products.service';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => UsersModule),
    PrismaModule,
    FileModule,
    CorreiosModule
  ],
  controllers: [ProductController],
  providers: [ProductService, PrismaService, FileService, PrismaClient],
  exports: [ProductService]
})
export class ProductModule {}
