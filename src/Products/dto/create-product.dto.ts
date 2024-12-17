import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  nome_produto: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  preco: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @ApiProperty()
  descricao: string;

  @IsNumber()
  @ApiProperty()
  estoque: number;

  @ApiProperty()
  @IsBoolean()
  oferta: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  diameter?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  length: number;

  @IsNumber()
  @ApiProperty()
  categoryId: number;
}
