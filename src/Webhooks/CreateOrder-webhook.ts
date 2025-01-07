import { BadRequestException, Controller, NotFoundException, Post, Req } from '@nestjs/common';
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
    console.error('Erro ao validar assinatura do webhook:', err);
    throw new BadRequestException('Falha ao verificar a assinatura do webhook');
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, cartId, adressId, selectedProducts } = this.extractSessionData(session);

      // Valida os dados essenciais da sessão
      this.validateOrderData(userId, cartId, adressId);

      // Calcula lucro total
      const totalProfit = this.calculateTotalProfit(
        selectedProducts.map((product) => ({
          id_produto: product.produtoId,
          amount: product.quantidade,
          price: product.preco,
        })),
      );

      console.log(`Lucro total: ${totalProfit}`);

      // Atualiza estoque
      await this.updateProductStock(
        selectedProducts.map((product) => ({
          id_produto: product.produtoId,
          amount: product.quantidade,
          price: product.preco,
        })),
      );

      // Cria o pedido no banco de dados
      await this.createOrder(userId, cartId, adressId, selectedProducts);

      return { success: true };
    }

    throw new BadRequestException('Evento não reconhecido');
  } catch (e) {
    console.error('Erro ao processar evento do Stripe:', e);
    throw new BadRequestException('Erro ao processar evento de pagamento');
  }
}




  private extractSessionData(session: Stripe.Checkout.Session) {
    const { userId, cartId, adressId, selectedProducts } = session.metadata;

    if (!userId || !cartId || !adressId || !selectedProducts) {
      throw new NotFoundException('Dados faltando na sessão de pagamento');
    }

    return {
      userId: Number(userId),
      cartId: Number(cartId),
      adressId: Number(adressId),
      selectedProducts: JSON.parse(selectedProducts), // Lista de { produtoId, quantidade, preco }
    };
  }

  // Valida se todos os dados necessários estão presentes
  private validateOrderData(userId: number, cartId: number, adressId: number) {
    if (!userId || !cartId || !adressId) {
      throw new NotFoundException('Dados obrigatórios não encontrados');
    }
  }

  // Calcula o lucro total com base nos produtos comprados
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

  // Cria o pedido e registra os produtos comprados
  private async createOrder(userId: number, cartId: number, adressId: number, selectedProducts: { produtoId: number, quantidade: number }[]) {
    const carrinho = await this.prisma.cart.findFirst({
      where: { id: cartId, active: true },
      include: {
        carrinho: {
          include: { produtos: true },
        },
      },
    });
  
    if (!carrinho || carrinho.carrinho.length === 0) {
      throw new NotFoundException('Carrinho vazio ou inexistente.');
    }
  
    // Filtra os produtos comprados
    const produtosComprados = carrinho.carrinho.filter((item) =>
      selectedProducts.some((selected) => selected.produtoId === item.produtoId),
    );
  
    if (produtosComprados.length === 0) {
      throw new BadRequestException('Nenhum produto válido selecionado para compra.');
    }
  
    // Cria o pedido
    const order = await this.prisma.order.create({
      data: {
        userId,
        cart_Id: cartId,
        adressId,
        OrderItem: {
          create: produtosComprados.map((item) => {
            const selected = selectedProducts.find((p) => p.produtoId === item.produtoId);
            return {
              produtoId: item.produtoId,
              quantidade: selected.quantidade,
              preco: item.produtos.preco,
            };
          }),
        },
      },
    });
  
    // Marca os itens comprados no carrinho como isPurchased = true
    for (const item of produtosComprados) {
      await this.prisma.card_produtos.update({
        where: { id: item.id },
        data: { isPurchased: true },
      });
    }
  
    return order;
  }
}
