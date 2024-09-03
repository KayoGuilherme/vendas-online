import { Module } from '@nestjs/common';
import { ProfitService } from './profit.service';
import { ProfitController } from './profit.controller';

import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [ProfitController],
  providers: [ProfitService, PrismaClient],
})
export class ProfitModule {}
