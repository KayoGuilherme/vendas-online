import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CartService } from '../cart/cart.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly cartService: CartService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(userId: number, selectedAdressId: number) {
    const cart = this.cartService.findCartByUserId(userId);
    const produtos = (await cart).carrinho;

    const line_items = produtos.map((item) => {
      return {
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.produtos.nome_produto,
            description: item.produtos.descricao,
          },
          unit_amount: item.produtos.preco * 100,
        },
        quantity: item.amount,
      };
    });

    const productPrices = produtos.map((item) => ({
      price: item.produtos.preco * 100
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      customer_creation: 'if_required',
      metadata: {
        userId,
        adressId: Number(selectedAdressId) ,
        cartId: (await cart).id,
        productPrices: JSON.stringify(
          produtos.map((item) => ({
            price: item.produtos.preco,
            amount: item.amount,
          })),
        ),
      },
    });

    return session;
  }
}
