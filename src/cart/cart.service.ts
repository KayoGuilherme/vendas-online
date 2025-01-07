import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { InserCartDto } from './dtos/insert-cart.dto';
import { CartProductService } from '../cartProduct/cart_product.service';
import { UpdateCartDto } from '../cartProduct/dto/update-cart.dto';

const LINE_AFFECTED = 1;

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly cartProductService: CartProductService,
  ) {}

  async clearCart(userId: number) {
    // Buscar o carrinho do usuário
    const cart = await this.findCartByUserId(userId);
  
    if (!cart) {
      throw new Error('Carrinho não encontrado');
    }
  
    // Excluir todos os itens da tabela `card_produtos` relacionados ao carrinho
    await this.prisma.card_produtos.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
  
    // Opcional: Marcar o carrinho como inativo
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { active: false },
    });
  
    return {
      message: 'Carrinho limpo com sucesso!',
      affectedCart: cart.id,
    };
  }
  

  async findCartByUserId(userId: number) {
    try {
      const cart = await this.prisma.cart.findFirst({
        where: {
          userId
        },
        include: {
          carrinho: {
            select: {
              amount: true,
              produtoId: true,
              cartId: true,
              Delivered: true,
              id: true,
              produtos: {
                select: {
                  nome_produto: true,
                  preco: true,
                  descricao: true,
                  imagem: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        throw new NotFoundException(`não foi possivel encotrar o carrinho`);
      }

      return cart;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('não foi possivel visualizar o carrinho.');
    }
  }

  async createCart(userId: number) {
    try {
      const cart = await this.prisma.cart.create({
        data: {
          active: true,
          userId,
        },
      });
      return cart;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Não foi possivel criar o carrinho');
    }
  }

  async insertProductInCart(data: InserCartDto, userId: number) {
    const cart = await this.findCartByUserId(userId).catch(async () => {
      return this.createCart(userId);
    });

    await this.cartProductService.insertProductInCart(data, cart);

    return cart;
  }

  async deleteProductInCart(produtoId: number, userId: number) {
    const cart = await this.findCartByUserId(userId);
    return this.cartProductService.deleteProductInCart(produtoId, cart.id);
  }

  async updateProductInCart(data: UpdateCartDto, userId: number) {
    const cart = await this.findCartByUserId(userId).catch(async () => {
      return this.createCart(userId);
    });

    await this.cartProductService.updateProductInCart(data, cart);

    return cart;
  }
}
