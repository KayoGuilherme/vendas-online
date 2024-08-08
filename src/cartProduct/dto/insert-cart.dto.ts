import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";



export class InserCartDto {

    @IsNumber()
    @ApiProperty()
    produtoId: number

    @ApiProperty()
    @IsNumber()
    amount: number


}