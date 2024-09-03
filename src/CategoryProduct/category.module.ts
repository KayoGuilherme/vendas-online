import { Module } from '@nestjs/common';
import { CategoryProductService } from './category.service';

import { CategoryProductController } from './category.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [CategoryProductService, PrismaClient ],
  controllers: [CategoryProductController],
})
export class CategoryProductModule {}
