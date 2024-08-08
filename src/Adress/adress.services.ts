import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AdressDTO } from './dto/adress-create.dto';
import { UsersService } from '../users/users.service';

const LINE_AFFECTED = 1;

@Injectable()
export class AdressService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly usersService: UsersService,
  ) {}

  async saveAdress(data: AdressDTO, userId: number) {
    await this.usersService.readById(userId);

    const adress = await this.prisma.adress.create({
      data,
    });

    return adress;
  }

  async getAdress(userId: number) {
    try {
      const adress = await this.prisma.adress.findMany({
        where: {
          userId,
        },
      });
      return adress;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Não foi possivel visualizar o endereço do usuario',
      );
    }
  }

  async updateAdress(
    {
      CEP,
      bairro,
      cidade,
      complemento,
      estado,
      numero,
      ponto_de_referencia,
      telefone_contato,
      Rua,
    }: AdressDTO,
    userId: number,
  ) {
    const user = await this.usersService.readById(userId);

    if (!user)
      throw new NotFoundException('não foi possivel encontrar o usuario');

    try {
      const adress = await this.prisma.adress.updateMany({
        data: {
          CEP,
          bairro,
          cidade,
          complemento,
          estado,
          numero,
          ponto_de_referencia,
          telefone_contato,
          Rua,
          userId,
        },
      });

      return { sucess: true };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'não foi possivel atualizar informações de endereço, por favor atualize a pagina e tente novamente.',
      );
    }
  }

  async deleteAdress(id: number, userId: number) {
    const user = await this.usersService.readById(userId);

    if (!user)
      throw new NotFoundException('não foi possivel encontrar o usuario');

    try {
      const adress = await this.prisma.adress.delete({
        where: {
          id,
        },
      });

      return {
        row: [],
        LINE_AFFECTED,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'não foi possivel deletar endereço, por favor tente novamente.',
      );
    }
  }
}
