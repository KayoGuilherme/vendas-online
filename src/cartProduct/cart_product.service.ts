import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InserCartDto } from './dto/insert-cart.dto';
import { cart, PrismaClient } from '@prisma/client';
import { ProductService } from '../Products/Products.service';
import { UpdateCartDto } from './dto/update-cart.dto';

const LINE_AFFECTED = 1;

@Injectable()
export class CartProductService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly productService: ProductService,
  ) {}

  async verifyProductInCart(produtoId: number, cartId: number) {
    const cartProduct = await this.prisma.card_produtos.findFirst({
      where: {
        produtoId,
        cartId,
      },
    });

    if (!cartProduct) {
      throw new NotFoundException(
        'nao foi possivel encontrar o produto no carrinho',
      );
    }

    return cartProduct;
  }

  async createProductInCart(data: InserCartDto, cartId: number) {
    return await this.prisma.card_produtos.create({
      data: {
        amount: data.amount,
        produtoId: data.produtoId,
        cartId,
      },
    });
  }

  async insertProductInCart(data: InserCartDto, cart: cart) {
    await this.productService.getById(data.produtoId);

    const cartProduct = await this.verifyProductInCart(
      data.produtoId,
      cart.id,
    ).catch(() => undefined);

    if (!cartProduct) {
      return this.createProductInCart(data, cart.id);
    }

    const { id, ...cartProductWithoutId } = cartProduct;

    return await this.prisma.card_produtos.update({
      where: { id: cartProduct.id },
      data: {
        amount: cartProduct.amount + data.amount,
      },
    });
  }

  async deleteProductInCart(produtoId: number, cartId: number) {
    try {
      const productInCart = await this.prisma.card_produtos.findFirst({
        where: {
          cartId,
          produtoId: Number(produtoId),
          inCart: true,
        },
      });

      if (!productInCart) {
        throw new NotFoundException('Produto não encontrado no carrinho.');
      }

      await this.prisma.card_produtos.update({
        where: { id: productInCart.id },
        data: {
          inCart: false,
        },
      });

      return {
        raw: [],
        affected: LINE_AFFECTED,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Não foi possível remover o produto do carrinho, por favor tente novamente.',
      );
    }
  }

  async updateProductInCart(data: UpdateCartDto, cart: cart) {
    await this.productService.getById(data.produtoId);

    const cartProduct = await this.verifyProductInCart(data.produtoId, cart.id);

    const { id, ...cartProductWithoutId } = cartProduct;

    return await this.prisma.card_produtos.update({
      where: { id: cartProduct.id },
      data: {
        amount: data.amount,
      },
    });
  }
}
