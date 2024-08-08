import { Module } from '@nestjs/common';
import { CategoryProductService } from './category.service';
import { PrismaClient } from '@prisma/client';
import { CategoryProductController } from './category.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [CategoryProductService, PrismaClient],
  controllers: [CategoryProductController],
})
export class CategoryProductModule {}
