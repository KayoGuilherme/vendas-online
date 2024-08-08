import { ApiProperty } from "@nestjs/swagger";
import {  IsJWT, IsString, MinLength } from "class-validator";

export class AuthUpdateDTO {
    @IsString()
    @MinLength(6)
    @ApiProperty()
    senha: string;


    @IsJWT()
    @ApiProperty()
    token: string;

}