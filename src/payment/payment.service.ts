import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CartService } from '../cart/cart.service';
import { ProductService } from 'src/Products/Products.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(
    userId: number,
    selectedAdressId: string,
    cepDestino: string,
  ) {
    //Puxo as informacoes do carrinho baseado no usuario
    const cart = this.cartService.findCartByUserId(userId);
    //capturo os produtos dentro do carrinho
    const produtos = (await cart).carrinho;

    //capturo o frete de entrega para somar com os produtos
    const freteOptions = await Promise.all(
      produtos.map((p) =>
        this.productService.findPriceDelivery(cepDestino, p.produtoId),
      ),
    );

    //Pego o total do frete e envio no lineItems do checkout
    const totalFrete = Number(freteOptions[0][0][0].pcFinal.replace(',', '.'));

    const line_items = produtos.map((item) => {
      const unitAmount = item.produtos.preco * 100;
      return {
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.produtos.nome_produto,
            description: item.produtos.descricao,
          },
          unit_amount: unitAmount,
        },
        quantity: item.amount,
      };
    });

    line_items.push({
      price_data: {
        currency: 'brl',
        product_data: {
          name: 'Frete',
          description: `Entrega padrão}`,
        },
        unit_amount: totalFrete * 100,
      },
      quantity: 1,
    });

    const productPrices = produtos.map((item) => ({
      price: item.produtos.preco * 100,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `https://yeshuaprofessional.vercel.app/pagamento-efetuado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://yeshuaprofessional.vercel.app/pagamento-erro',
      customer_creation: 'if_required',
      metadata: {
        userId,
        adressId: Number(selectedAdressId),
        cartId: (await cart).id,
        productPrices: JSON.stringify(
          produtos.map((item) => ({
            price: item.produtos.preco,
            amount: item.amount,
            id_produto: item.produtoId,
          })),
        ),
        frete: JSON.stringify(totalFrete),
      },
    });

    return session;
  }
}
