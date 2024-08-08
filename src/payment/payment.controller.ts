import {
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { User } from '../decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import Stripe from 'stripe';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Controle de Pagamento')
@Controller('payments')
export class PaymentController {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create-checkout-session')
  async createCheckoutSession(@User() userId: number, selectedAdressId: number) {
    const session = await this.paymentService.createCheckoutSession(userId, selectedAdressId);
    return {
      url: session.url,
    };
  }
}
