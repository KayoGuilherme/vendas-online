import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";



export class UpdateCartDto {


    @IsNumber()
    @ApiProperty()
    produtoId: number

    @ApiProperty()
    @IsNumber()
    amount: number

}
