import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class AuthForgetDTO {
    @IsEmail()
    @ApiProperty()
    email: string;
}