import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ReviewDto {
  @ApiProperty({
    description: 'Identificador do pedido relacionado à avaliação',
    example: 123,
  })
  @IsNotEmpty({ message: 'O campo orderId não pode ser vazio.' })
  @IsInt({ message: 'O campo orderId deve ser um número inteiro.' })
  orderId: number;

  @ApiProperty({
    description: 'Identificador do usuário que está fazendo a avaliação',
    example: 1,
  })
  @IsNotEmpty({ message: 'O campo userId não pode ser vazio.' })
  @IsInt({ message: 'O campo userId deve ser um número inteiro.' })
  userId: number;

  @ApiProperty({
    description: 'Identificador do produto relacionado à avaliação',
    example: 456,
  })
  @IsNotEmpty({ message: 'O campo productId não pode ser vazio.' })
  @IsInt({ message: 'O campo productId deve ser um número inteiro.' })
  productId: number;

  @ApiProperty({
    description: 'Nota atribuída ao produto, entre 1 e 5',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty({ message: 'O campo rating não pode ser vazio.' })
  @IsInt({ message: 'O campo rating deve ser um número inteiro.' })
  @Min(1, { message: 'O campo rating deve ser no mínimo 1.' })
  @Max(5, { message: 'O campo rating deve ser no máximo 5.' })
  rating: number;

  @ApiProperty({
    description: 'Comentário opcional sobre o produto',
    example: 'Ótimo produto, chegou no prazo!',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O campo comment deve ser uma string.' })
  comment?: string;
}
