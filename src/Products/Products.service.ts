import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { SizeProductDTO } from '../correios/dto/size-product.dto';
import { CorreiosService } from '../correios/correios.service';
import { CdServiceEnum } from '../correios/enums/cd-service.enum';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly correiosService: CorreiosService,
  ) {}

  async get() {
    try {
      const Produtos = await this.prisma.produtos.findMany({
        include: {
          imagem: {
            select: {
              url: true,
              produtoId: true,
            },
          },
        },
      });
      return {
        message: 'Lista de Produtos',
        Produtos,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Nao foi possivel visalizar os Produtos.');
    }
  }
  async getById(id_produto: number) {
    try {
      const product = await this.prisma.produtos.findFirst({
        where: {
          id_produto: Number(id_produto),
        },
        include: {
          imagem: {
            select: {
              url: true,
              produtoId: true,
            },
          },
        },
      });
  
      if (!product) {
        throw new NotFoundException('Esse Produto não existe');
      }
  
      return product;
    } catch (error) {
      console.error('Erro ao obter produto:', error);
      throw new BadRequestException('Não foi possível visualizar este produto.');
    }
  }
  

  async create(data: CreateProductDto) {
    try {
      const product = this.prisma.produtos.create({
        data,
      });

      if (isNaN(Number(data.preco)) || isNaN(Number(data.estoque))) {
        throw new BadRequestException('Preco and estoque must be a number.');
      }

      return product;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(
        'Erro na criação do produto, preencha os campos Corretamente.',
      );
    }
  }

  async update(
    id_produto: number,
    {
      nome_produto,
      preco,
      descricao,
      estoque,
      categoryId,
      oferta,
      width,
      diameter,
      height,
      weight,
      length
    }: UpdateProductDto,
  ) {
    try {
      const productExist = await this.prisma.produtos.findUnique({
        where: {
          id_produto: Number(id_produto),
        },
      });
      if (!productExist) throw new NotFoundException('Esse produto nao existe');

      const product = await this.prisma.produtos.update({
        data: {
          nome_produto,
          preco,
          descricao,
          estoque,
          categoryId,
          oferta,
          width,
          weight,
          diameter,
          height,
          length
        },
        where: {
          id_produto: Number(id_produto),
        },
      });

      return {
        message: 'Produto Atualizado com sucesso',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Erro na modificação de informações do produto',
      );
    }
  }

  async delete(id_produto: number) {
    try {
      const productExist = await this.prisma.produtos.findFirst({
        where: {
          id_produto: Number(id_produto),
        },
      });
      if (!productExist)
        throw new NotFoundException(
          `Esse produto do id: ${id_produto} não existe`,
        );

      await this.prisma.imageProduto.deleteMany({
        where: {
          produtoId: Number(id_produto),
        },
      });

      

      await this.prisma.card_produtos.deleteMany({
        where: {
          produtoId: Number(id_produto),
        },
      });

      const product = await this.prisma.produtos.delete({
        where: {
          id_produto: Number(id_produto),
        },
      });

      return { sucess: true };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Não foi possivel excluir o produto.');
    }
  }

  async updateStock(id_produto: number, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantidade deve ser positiva');
    }

    return this.prisma.produtos.update({
      where: { id_produto: Number(id_produto) },
      data: {
        estoque: {
          decrement: quantity,
        },
      },
    });
  }

  async findPriceDelivery(cep: string, id_produto: number) {
    try {
      const product = await this.getById(id_produto);

      if (!product) {
        throw new BadRequestException('Produto não encontrado');
      }
  
      const sizeProduct = new SizeProductDTO(product);
  
      const resultPrice = await Promise.all([
        this.correiosService.priceDelivery(CdServiceEnum.PAC, cep, sizeProduct),
        this.correiosService.priceDelivery(CdServiceEnum.SEDEX, cep, sizeProduct),
        this.correiosService.priceDelivery(CdServiceEnum.SEDEX_10, cep, sizeProduct),
      ]);
  
      return resultPrice;
    } catch (error) {
      console.error('Erro ao encontrar o preço de entrega:', error);
      throw new BadRequestException('Erro ao encontrar o preço de entrega.');
    }
  }
}
