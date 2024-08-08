import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProductCategoryDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    nome_produto: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    nome: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    preco: number;      

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    descricao: string;

    @IsNumber()
    @ApiProperty()
    estoque: number;

    @ApiProperty()
    @IsBoolean()
    oferta: boolean;

    @IsNumber()
    @ApiProperty()
    categoryId: number;
}