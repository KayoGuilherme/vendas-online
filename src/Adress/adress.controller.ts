import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdressDTO } from './dto/adress-create.dto';
import { Paramid } from '../decorators/param-id.decorator';
import { AdressService } from './adress.services';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';

@UseGuards(AuthGuard)
@ApiTags('Controle de Endereços')
@Controller('Endereco')
export class AdressController {
  constructor(private readonly adressService: AdressService) {}

  @Get()
  async getAdress(@User() enderecoId: number) {
    return this.adressService.getAdress(enderecoId);
  }

  @Post()
  async saveAdress(@Body() data: AdressDTO, @User() userId: number) {
    return this.adressService.saveAdress(data, userId);
  }

  @Patch()
  async updateAdress(@Body() data: AdressDTO, @User() userId: number) {
    return this.adressService.updateAdress(data, userId);
  }

  @Delete(':id')
  async deleteAdress(@Paramid() id: number, @User() userId: number) {
    return this.adressService.deleteAdress(id, userId);
  }
}
