import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import { SendtrackingDto } from './dtos/send-tracking-dto';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly mailer: MailerService,
    private readonly users: UsersService,
    private readonly cartService: CartService,
  ) {}

  async getOrderProducts() {
    try {
      const products = await this.prisma.order.findMany({
        include: {
          users: {
            select: {
              nome: true,
              email: true,
              CPF: true,
            },
          },
          adress: {
            select: {
              estado: true,
              cidade: true,
              bairro: true,
              Rua: true,
              numero: true,
              CEP: true,
              telefone_contato: true,
              complemento: true,
              ponto_de_referencia: true,
            },
          },
          carrinho: {
            select: {
              carrinho: {
                select: {
                  carrinho: {
                    include: {
                      produtos: {
                        select: {
                          nome_produto: true,
                          preco: true,
                          imagem: {
                            select: {
                              url: true,
                              produtoId: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return products;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Não foi possivel visualizar todos os pedidos existentes',
      );
    }
  }

  async getOrderProductsByUser(userId: number) {
    try {
      const user = await this.prisma.order.findFirst({
        where: {
          userId: Number(userId),
        },
      });

      if (!user) {
        throw new NotFoundException('Nao existe pedidos para esse usuario');
      }

      const OrderByUser = await this.prisma.order.findFirst({
        where: {
          userId: Number(userId),
        },
        include: {
          users: {
            select: {
              nome: true,
              email: true,
              CPF: true,
            },
          },
          adress: {
            select: {
              estado: true,
              cidade: true,
              bairro: true,
              Rua: true,
              numero: true,
              CEP: true,
              telefone_contato: true,
              complemento: true,
              ponto_de_referencia: true,
            },
          },
          carrinho: {
            select: {
              carrinho: {
                select: {
                  carrinho: {
                    include: {
                      produtos: {
                        select: {
                          nome_produto: true,
                          preco: true,
                          imagem: {
                            select: {
                              url: true,
                              produtoId: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      return OrderByUser;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Não foi possivel visualizar pedidos desse Usuario',
      );
    }
  }

  async getOrderUser(userId: number) {
    try {
      const user = await this.prisma.order.findFirst({
        where: {
          userId: Number(userId),
        },
      });

      if (!user)
        throw new NotFoundException('Nao existe pedidos para esse usuario');

      const OrderByUser = await this.prisma.order.findMany({
        where: {
          userId: Number(userId),
        },
        include: {
          users: {
            select: {
              nome: true,
              email: true,
            },
          },
          adress: {
            select: {
              estado: true,
              cidade: true,
              bairro: true,
              Rua: true,
              numero: true,
              CEP: true,
              telefone_contato: true,
              complemento: true,
              ponto_de_referencia: true,
            },
          },
          carrinho: {
            select: {
              carrinho: {
                select: {
                  carrinho: {
                    include: {
                      produtos: {
                        select: {
                          nome_produto: true,
                          preco: true,
                          imagem: {
                            select: {
                              url: true,
                              produtoId: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      return OrderByUser;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Não foi possivel visualizar pedidos desse Usuario',
      );
    }
  }

  async DeliveredProduct(
    id_order: number,
    userId: number,
    cardProductId: number,
  ) {
    try {
      await this.users.readById(userId);

      const order = await this.prisma.order.findFirst({
        where: { id_order, userId },
      });
      if (!order) {
        throw new NotFoundException(
          'Esse pedido não existe ou não está associado a esse usuário.',
        );
      }

      const productItem = await this.prisma.card_produtos.findFirst({
        where: { id: Number(cardProductId), cartId: order.cart_Id },
      });
      if (!productItem) {
        throw new NotFoundException(
          'Esse produto não está associado a esse pedido.',
        );
      }

      const deliveredItem = await this.prisma.card_produtos.update({
        where: { id: Number(cardProductId) },
        data: { Delivered: true },
      });

      return {
        success: true,
        message: 'Produto confirmado como entregue.',
        deliveredItem,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Não foi possível confirmar a entrega do produto.',
      );
    }
  }

  async SendTrackingCode(data: SendtrackingDto, userId: number) {
    const order = await this.getOrderProductsByUser(userId);
    const user = await this.users.readById(order.userId);
    const cart = await this.cartService.findCartByUserId(order.cart_Id);

    try {
      await this.prisma.order.update({
        where: {
          id_order: order.id_order,
        },
        data,
      });

      const productNames = cart.carrinho
        .map((item) => item.produtos.nome_produto.toString())
        .join(', ');

      const Template = {
        name: user.nome,
        email: user.email,
        trackingCode: data.trackingCode,
        productName: productNames,
        logo: 'https://project-recogreen.s3.amazonaws.com/logo-removebg-preview.png',
      };

      await this.mailer.sendMail({
        to: `${user.email}`,
        subject: 'Código de Rastreio do Pedido',
        template: 'trackingCode',
        context: Template,
      });

      return true;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Nao foi possivel enviar o codigo para o usuario, tente novamente.',
      );
    }
  }

  async DeleteOrder(id_order: number) {
    try {
      const Order = await this.prisma.order.findFirst({
        where: {
          id_order: Number(id_order),
        },
      });

      if (!Order)
        throw new NotFoundException(
          'Esse pedido nao existe ou nao foi encontrado na base de dados.',
        );

      const deleteOrder = await this.prisma.order.delete({
        where: {
          id_order: Number(id_order),
        },
      });

      return { sucess: true };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('não foi possivel deletar esse pedido.');
    }
  }

  async getOrderBySession(sessionId: string) {
    const order = await this.prisma.order.findFirst({
      where: { sessionId },
      select: {
        id_order: true,
        createdAt: true,
        OrderItem: {
          select: {
            quantidade: true,
            preco: true,
            produto: {
              select: {
                nome_produto: true,
                imagem: true,
              },
            },
          },
        },
        adress: {
          select: {
            Rua: true,
            numero: true,
            complemento: true,
            bairro: true,
            cidade: true,
            estado: true,
            CEP: true,
          },
        },
        users: {
          select: {
            nome: true,
            email: true,
            CPF: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    return order;
  }
}
