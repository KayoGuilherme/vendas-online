import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProductService } from './Products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileService } from '../file/file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { Paramid } from '../decorators/param-id.decorator';
import { ParamId_produto } from '../decorators/param-id_produto.decorator';
import { ParamProdutoId } from '../decorators/param-produtoId.decorator';

@Controller('product')
@ApiTags('Controle de Produtos')
export class ProductController {
  constructor(
    private readonly ProductService: ProductService,
    private readonly FileService: FileService,
  ) {}


  
  @Get()
  async getProduct() {
    return this.ProductService.get();
  }

  @Get(':id')
  async getProductById(@Paramid() id) {
    return this.ProductService.getById(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Post('create')
  async createProduct(@Body() data: CreateProductDto) {
    return this.ProductService.create(data);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Put(':id')
  async updateProduct(@Body() data: UpdateProductDto, @Paramid() id) {
    return this.ProductService.update(id, data);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
  @Post('Image/:produtoId')
  async photoProduct(
    @UploadedFile() file: Express.Multer.File,
    @ParamProdutoId() produtoId: number,
  ) {
    
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }
    const fileName = file.originalname;
    const fileBuffer = file.buffer;
    return this.FileService.uploadfiles(fileBuffer, fileName, produtoId);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Delete('Image/:fileName/:id')
  async deletePhotoProduct(
    @Param('fileName') fileName: string,
    @Paramid() produtoId: number,
  ) {
    return this.FileService.deleteFile(fileName, produtoId);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async deleteProduct(@Paramid() id_produto: number) {
    return this.ProductService.delete(id_produto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Patch(':id_produto')
  async updateStock(
    @ParamId_produto() id_produto: number,
    @Body() quantity: number,
  ) {
    return this.ProductService.updateStock(Number(id_produto), quantity);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id_produto/delivery/:cep')
  async findPriceDelivery(
    @ParamId_produto() id_produto: number,
    @Param('cep') cep: string,
  ) {
    return this.ProductService.findPriceDelivery(cep, id_produto);
  }
}
