import {
  BadRequestException,
  Controller,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common';
import { ProductService } from '../Products/Products.service';
import { PrismaService } from '../database/prisma.service';
import Stripe from 'stripe';

type IProduto = {
  id_produto: number;
  amount: number
}

@Controller('')
export class WebhookController {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService
    ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  @Post('payments/webhook')
  async handleWebhook(@Req() req: Request) {
    let event: Stripe.Event;

    try {
      const sig = req.headers['stripe-signature'];
      const rawBody = req.body.toString();

      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        String(process.env.STRIPE_WEBHOOK_SECRET),
      );
    } catch (err) {
      throw new BadRequestException(
        'nao foi possivel pegar as informacoes para continuar com o evento',
      );
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const data = {
          userId: Number(session.metadata.userId),
          cart_Id: Number(session.metadata.cartId),
          adressId: Number(session.metadata.adressId),
        };


        if (!data.userId || !data.cart_Id || !data.adressId) {
          throw new NotFoundException('Dados nao econtrados');
        }

        const productPrices = JSON.parse(session.metadata.productPrices);
        let totalProfit = 0;
        productPrices.forEach((item) => {
          totalProfit += item.price * item.amount;
        });


        for (const product of productPrices) {
          const { id_produto, amount } = product as IProduto;

          await this.productService.updateStock(id_produto, amount);
        }

        if (isNaN(totalProfit) || totalProfit <= 0) {
          throw new BadRequestException('Lucro total inválido');
        }

      const profit =  await this.prisma.profit.create({
          data: {
            amount: totalProfit,
          },
        });

        console.log(profit);

        await this.prisma.order.create({
          data,
        });
      }

      return { sucess: true };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(
        'Não foi possivel capturar ação, erro interno do servidor.' + e,
      );
    }
  }
}
