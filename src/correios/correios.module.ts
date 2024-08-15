import { Module } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { CorreiosController } from './correios.controller';


@Module({
  controllers: [CorreiosController],
  providers: [CorreiosService],
  exports:[CorreiosService]
})
export class CorreiosModule {}
