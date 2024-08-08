import { ApiProperty } from "@nestjs/swagger";
import {  IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


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