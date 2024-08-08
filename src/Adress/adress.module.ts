import { Module } from '@nestjs/common';
import { AdressService } from './adress.services';
import { PrismaClient } from '@prisma/client';
import { AdressController } from './adress.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [AdressService, PrismaClient],
  controllers: [AdressController],
})
export class AdressModule {}
