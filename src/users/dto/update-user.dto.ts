import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/enums/role.enum';
import { Genero } from 'src/enums/genero.enum';


export class UpdateUserDto {
     @IsNotEmpty()
      @IsString()
      @ApiProperty({ required: true })
      nome: string;
    
      @IsNotEmpty()
      @IsEmail()
      @ApiProperty({ required: true })
      email: string;
    
      @IsString()
      @MinLength(6)
      @ApiProperty({ required: true })
      senha: string;
    
      @IsNotEmpty()
      @IsString()
      @ApiProperty({ required: true })
      Telefone: string;
    
      @IsEnum(Role)
      @ApiProperty({ enum: ['Admin', 'User'], default: 1 })
      @IsOptional()
      role: Role.cliente;
    
      @IsEnum(Genero)
      @IsNotEmpty()
      @ApiProperty()
      @IsString()
      genero: string;
    
      @IsString()
      @IsNotEmpty()
      @MaxLength(11)
      @MinLength(11)
      @ApiProperty()
      CPF: string;
}
