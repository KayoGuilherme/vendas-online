import { Module } from '@nestjs/common';
import { CorreiosService } from './correios.service';



@Module({
  providers: [CorreiosService],
  exports:[CorreiosService]
})
export class CorreiosModule {}
