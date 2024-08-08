import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InserCartDto } from './dtos/insert-cart.dto';
import { CartService } from './cart.service';
import { User } from '../decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Paramid } from '../decorators/param-id.decorator';
import { UpdateCartDto } from '../cartProduct/dto/update-cart.dto';

@ApiTags('Carrinho')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Post('insert')
  async createCart(@Body() data: InserCartDto, @User() userId: number) {
    return this.cartService.insertProductInCart(data, userId);
  }

  @UseGuards(AuthGuard)
  @Get('find')
  async findCartByUserId(@User() userId: number) {
    return this.cartService.findCartByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Delete('clear')
  async clearCart(@User() userId: number) {
    return this.cartService.clearCart(userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async DeleteProductInCart(
    @Paramid() produtoId: number,
    @User() userId: number,
  ) {
    return this.cartService.deleteProductInCart(produtoId, userId);
  }

  @UseGuards(AuthGuard)
  @Patch('update')
  async updateProductInCart(
    @Body() data: UpdateCartDto,
    @User() userId: number,
  ) {
    return this.cartService.updateProductInCart(data, userId);
  }
}
