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
  amount: number;
  price: number;
};

@Controller('')
export class WebhookController {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  // Handler para o Webhook do Stripe
  @Post('payments/webhook')
  async handleWebhook(@Req() req: Request) {
    let event: Stripe.Event;

    try {
      // Verificando a assinatura do webhook
      const sig = req.headers['stripe-signature'];
      const rawBody = req.body.toString();
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        String(process.env.STRIPE_WEBHOOK_SECRET),
      );
    } catch (err) {
      console.error('Erro ao validar assinatura do webhook:', err);
      throw new BadRequestException(
        'Falha ao verificar a assinatura do webhook',
      );
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const { userId, cartId, adressId, productPrices, frete } =
          this.extractSessionData(session);

        // Valida os dados necessários
        this.validateOrderData(userId, cartId, adressId);

        // Calcula o lucro total
        const totalProfit = this.calculateTotalProfit(productPrices);

        // Atualiza o estoque dos produtos
        await this.updateProductStock(productPrices);

        // Cria o pedido
        const order = await this.createOrder(userId, cartId, adressId);

        // Move os produtos do carrinho para os itens do pedido
        await this.moveProductsToOrder(cartId, order.id_order);

        return { success: true, orderId: order.id_order, totalProfit };
      }

      throw new BadRequestException('Evento não reconhecido');
    } catch (error) {
      console.error('Erro ao processar evento do Stripe:', error);
      throw new BadRequestException('Erro ao processar evento de pagamento');
    }
  }

  // Extrai os dados da sessão do Stripe
  private extractSessionData(session: Stripe.Checkout.Session) {
    const { userId, cartId, adressId, productPrices, frete } = session.metadata;

    if (!userId || !cartId || !adressId || !productPrices || !frete) {
      throw new NotFoundException('Dados faltando na sessão de pagamento');
    }

    return {
      userId: Number(userId),
      cartId: Number(cartId),
      adressId: Number(adressId),
      productPrices: JSON.parse(productPrices),
      frete: Number(frete),
    };
  }

  // Valida os dados essenciais para o pedido
  private validateOrderData(userId: number, cartId: number, adressId: number) {
    if (!userId || !cartId || !adressId) {
      throw new NotFoundException('Dados obrigatórios não encontrados');
    }
  }

  // Calcula o lucro total
  private calculateTotalProfit(productPrices: IProduto[]): number {
    let totalProfit = 0;
    productPrices.forEach((item) => {
      totalProfit += item.amount * item.price;
    });
    if (isNaN(totalProfit) || totalProfit <= 0) {
      throw new BadRequestException('Lucro total inválido');
    }
    return totalProfit;
  }

  // Atualiza o estoque dos produtos comprados
  private async updateProductStock(productPrices: IProduto[]) {
    for (const product of productPrices) {
      await this.productService.updateStock(product.id_produto, product.amount);
    }
  }

  // Cria o pedido no banco de dados
  private async createOrder(userId: number, cartId: number, adressId: number) {
    return this.prisma.order.create({
      data: {
        userId,
        cart_Id: cartId,
        adressId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // Move os produtos do carrinho para os itens do pedido
  private async moveProductsToOrder(cartId: number, orderId: number) {
    const cartProducts = await this.prisma.card_produtos.findMany({
      where: { cartId },
      include: {
        produtos: true, 
      },
    });
    
    if (!cartProducts || cartProducts.length === 0) {
      throw new NotFoundException('Carrinho está vazio.');
    }

    for (const product of cartProducts) {
      await this.prisma.orderItem.create({
        data: {
          orderId,
          produtoId: product.produtoId,
          quantidade: product.amount,
          preco: product.produtos.preco,
          produtoNome: product.produtos.nome_produto,
        },
      });
    }

   
    await this.prisma.card_produtos.deleteMany({
      where: { cartId },
    });
  }
}
