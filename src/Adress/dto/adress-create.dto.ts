import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber,  IsString, MinLength, MaxLength } from "class-validator";

export class AdressDTO {


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    @MinLength(8)
    @MaxLength(8)
    CEP: string;


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    numero: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    complemento: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    ponto_de_referencia: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    bairro: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    estado: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    cidade: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    @MinLength(11)
    @MaxLength(11)
    telefone_contato: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    userId: number;


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    Rua: string;
}