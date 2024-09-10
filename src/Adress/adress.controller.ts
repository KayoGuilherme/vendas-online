import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdressDTO } from './dto/adress-create.dto';
import { Paramid } from '../decorators/param-id.decorator';
import { AdressService } from './adress.services';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';



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

  @UseGuards(AuthGuard)
  @Put(":id")
  async updateAdress(@Body() data: AdressDTO, @User() userId: number, @Paramid() id: number) {
    console.log(userId);
    return this.adressService.updateAdress(data, userId, id);
  }

  @Delete(':id')
  async deleteAdress(@Paramid() id: number, @User() userId: number) {
    return this.adressService.deleteAdress(id, userId);
  }
}
