import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class ProfitService {
  constructor(private readonly prisma: PrismaClient ) {}

  async getTotalProfit() {
    const profits = await this.prisma.profit.findMany();
    const totalProfit = profits.reduce((acc, profit) => acc + profit.amount, 0);
    return totalProfit;
  }
}
