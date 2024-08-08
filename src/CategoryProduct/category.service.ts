import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class CategoryProductService {
  constructor(private readonly prisma: PrismaClient) {}

  async createCategory(data: CreateCategoryDTO) {
    try {
      const category = this.prisma.category.create({
        data,
      });

      return category;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Erro: não foi possivel criar a categoria');
    }
  }

  async getCategory() {
    try {
      const getCategory = await this.prisma.category.findMany({
        include: {
          Produtos: {
            select: {
              id_produto: true,
              nome_produto: true,
              descricao: true,
              preco: true,
              estoque: true,
              oferta: true,
              imagem: {
                select: {
                  produtoId: true,
                  url: true,
                },
              },
            },
          },
        },
      });

      return getCategory;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Erro ao visualizar Categorias');
    }
  }

  async update({ nome }: UpdateCategoryDto, id: number) {
    try {
      const categoryExist = await this.prisma.category.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!categoryExist)
        throw new NotFoundException('Essa Categoria não existe.');

      const category = await this.prisma.category.update({
        where: {
          id: Number(id),
        },
        data: {
          nome,
        },
      });

      return { sucess: true };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Não foi possivel atualizar esta categoria.',
      );
    }
  }

  async delete(id: number) {
    try {
      const categoryExist = await this.prisma.category.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!categoryExist)
        throw new NotFoundException('Essa Categoria não existe.');

      const deleteCategory = await this.prisma.category.delete({
        where: {
          id: Number(id),
        },
      });

      return { sucess: true };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Não foi possivel deletar a categoria.');
    }
  }
}
