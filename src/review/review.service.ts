import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewDto } from './dto/review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaClient } from '@prisma/client';
import { OrderService } from 'src/order-product/order.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly orderSevice: OrderService,
  ) {}

  async addReview(data: ReviewDto, userId: number) {
    const orderUser = await this.prisma.order.findFirst({
      where: {
        id_order: data.orderId,
        userId,
      },
    });

    if (!orderUser) {
      throw new NotFoundException(
        'Pedido não encontrado ou não pertence ao usuário.',
      );
    }

   

    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        produtoId: data.productId,
        orderId: data.orderId,
      },
    });

    if (existingReview) {
      throw new BadRequestException(
        'Você já avaliou este produto para este pedido.',
      );
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        produtoId: data.productId,
        orderId: data.orderId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    return review;
  }

  async getUserReviews(userId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      include: {
        produto: {
          select: { nome_produto: true },
        },
      },
    });

    if (reviews.length === 0) {
      throw new NotFoundException(
        'Nenhuma avaliação encontrada para este usuário.',
      );
    }

    return reviews;
  }

  async getReviewsByProduct(produtoId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { produtoId: produtoId },
      include: {
        user: {
          select: { nome: true },
        },
      },
    });

    if (reviews.length === 0) {
      throw new NotFoundException(
        'Nenhum comentário encontrado para este produto.',
      );
    }

    return reviews;
  }

  async updateReview(userId: number, data: UpdateReviewDto, id: number) {
    const review = await this.prisma.review.findFirst({
      where: {
        id,
        userId: data.userId,
      },
    });

    if (!review) {
      throw new NotFoundException(
        'Comentário não encontrado ou você não tem permissão para atualizá-lo.',
      );
    }

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data,
    });

    return updatedReview;
  }

  async deleteReview(userId: number, id: number) {
    const review = await this.prisma.review.findFirst({
      where: {
        id: id,
        userId,
      },
    });

    if (!review) {
      throw new NotFoundException(
        'Comentário não encontrado ou você não tem permissão para removê-lo.',
      );
    }

    await this.prisma.review.delete({
      where: { id },
    });

    return { success: true, message: 'Comentário removido com sucesso.' };
  }
}
