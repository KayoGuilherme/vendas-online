import { Body, Controller, Delete, Get, Post, Put, UseGuards } from "@nestjs/common";
import { AdressDTO } from "./dto/adress-create.dto";
import { Paramid } from "../decorators/param-id.decorator";
import { AdressService } from "./adress.services";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "../decorators/user.decorator";


@ApiTags("Controle de Endereços")
@Controller("Endereco")
export class AdressController {
  constructor(private readonly adressService: AdressService) {
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAdress(@User() enderecoId: number) {
    return this.adressService.getAdress(enderecoId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async saveAdress(@User() userId: number, @Body() data: AdressDTO) {
    return this.adressService.saveAdress(data, Number(userId));
  }

  @UseGuards(AuthGuard)
  @Put(":id")
  async updateAdress(@Body() data: AdressDTO, @Paramid() id: number, @User() userId: number) {
    return this.adressService.updateAdress(id, userId, data);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  async deleteAdress(@Paramid() id: number, @User() userId: number) {
    return this.adressService.deleteAdress(id, userId);
  }
}
