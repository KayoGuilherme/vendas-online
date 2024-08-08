import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProfitService } from './profit.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/role.decorator';

@UseGuards(AuthGuard, RoleGuard)
@ApiTags('Lucro total')
@Controller('profit')
export class ProfitController {
  constructor(private readonly profitService: ProfitService) {}

  @Roles(Role.Admin)
  @Get('total')
  async getTotalProfit() {
    return this.profitService.getTotalProfit();
  }
}
