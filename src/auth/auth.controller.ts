import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { AuthDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthUpdateDTO } from './dto/auth-updatePass.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { users } from '@prisma/client';

@Controller()
@ApiTags('Controle de autenticação')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('registrar')
  async register(@Body() data: AuthRegisterDTO) {
    return this.AuthService.register(data);
  }

  @Post('login')
  async Login(@Body() { email, senha }: AuthDTO) {
    return this.AuthService.Login({ email, senha });
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user: users) {
    return user;
  }

  @Post('Forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.AuthService.forget(email);
  }

  @UseGuards(AuthGuard)
  @Put('UpdatePass')
  async updatePass(
    @Body() { senha, token }: AuthUpdateDTO,
    @User() id: number,
  ) {
    return this.AuthService.updatePass(senha, token, id);
  }
}
