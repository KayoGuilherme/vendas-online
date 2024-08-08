import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaClient, users } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    private readonly userService: UsersService,
    private readonly mailer: MailerService,
    private readonly prisma: PrismaClient,
  ) {}

  createToken(user: users) {
    return {
      accessToken: this.JWTService.sign(
        {
          id: user.id,
          name: user.nome,
          email: user.email,
          role: user.role,
          CPF: user.CPF,
          telefone: user.Telefone,
        },
        {
          secret: String(process.env.JWT_SECRET),
          expiresIn: '1 day',
          subject: String(user.id),
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.JWTService.verify(token, {
        secret: String(process.env.JWT_SECRET),
      });

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }

  async Login({ email, senha }: AuthDTO) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException('Email ou senha incorretos');

    if (!(await bcrypt.compare(senha, user.senha))) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException('Email incorreto/ não existe');

    const token = this.JWTService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '10 minutes',
        subject: String(user.id),
        secret: String(process.env.JWT_SECRET),
      },
    );

    await this.mailer.sendMail({
      subject: 'Recuperação de senha',
      to: `${user.email}`,
      template: 'forget',
      context: {
        name: user.nome,
        link: process.env.UPDATE_PASS,
      },
    });

    return { access: token };
  }

  async updatePass(senha: string, token: string, id: number) {
    try {
      const data: any = this.JWTService.verify(token, {
        secret: String(process.env.JWT_SECRET),
      });

      if (isNaN(Number(data.id))) {
        throw new BadRequestException('Token Invalido');
      }

      const salt = await bcrypt.genSalt();
      senha = await bcrypt.hash(senha, salt);

      await this.prisma.users.update({
        data: {
          senha,
        },
        where: {
          id: Number(id),
        },
      });

      return { message: 'Senha Modificada com sucesso' };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(
        'nao foi possivel atualizar a senha do usuario',
      );
    }
  }
}
