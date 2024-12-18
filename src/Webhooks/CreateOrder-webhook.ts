import { BadRequestException, Controller, NotFoundException, Post, Req } from '@nestjs/common';
import { ProductService } from '../Products/Products.service';
import { PrismaService } from '../database/prisma.service';
import Stripe from 'stripe';

type IProduto = {
  id_produto: number;
  amount: number;
  price: number
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
      // Verificando a assinatura para garantir que o webhook é legítimo
      const sig = req.headers['stripe-signature'];
      const rawBody = req.body.toString();
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        String(process.env.STRIPE_WEBHOOK_SECRET),
      );
    } catch (err) {
      // Caso a assinatura não seja válida
      console.error('Erro ao validar assinatura do webhook', err);
      throw new BadRequestException('Falha ao verificar a assinatura do webhook');
    }

    // Tratamento do evento específico
    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // Pega os dados adicionais do evento (metadados enviados durante a criação do pagamento)
        const { userId, cartId, adressId, productPrices, frete } = this.extractSessionData(session);

        // Verifica se os dados necessários estão presentes
        this.validateOrderData(userId, cartId, adressId);

        // Calcula o lucro total dos produtos
        const totalProfit = this.calculateTotalProfit(productPrices);

        // Atualiza o estoque dos produtos comprados
        await this.updateProductStock(productPrices);

        // Cria o pedido no banco de dados
        const order = await this.createOrder(userId, cartId, adressId);


        return { success: true };
      }

      throw new BadRequestException('Evento não reconhecido');
    } catch (e) {
      console.error('Erro ao processar evento do Stripe:', e);
      throw new BadRequestException('Erro ao processar evento de pagamento');
    }
  }

  // Método para extrair e validar os dados da sessão de pagamento
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

  // Valida se todos os dados necessários estão presentes
  private validateOrderData(userId: number, cartId: number, adressId: number) {
    if (!userId || !cartId || !adressId) {
      throw new NotFoundException('Dados obrigatórios não encontrados');
    }
  }

  // Calcula o lucro total com base nos preços dos produtos
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

  // Cria o pedido na base de dados
  private async createOrder(userId: number, cart_Id: number, adressId: number) {
    return this.prisma.order.create({
      data: {
        userId,
        cart_Id,
        adressId,
      },
    });
  }

  
  }

