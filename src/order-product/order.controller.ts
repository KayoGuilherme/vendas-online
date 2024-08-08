import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/role.decorator';
import { RoleGuard } from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { SendtrackingDto } from './dtos/send-tracking-dto';
import { ParamUserId } from '../decorators/param-userId.decorator';
import { Paramid } from '../decorators/param-id.decorator';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
@ApiTags('Controle de Pedidos')
@UseGuards(AuthGuard, RoleGuard)
@Controller('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(Role.Admin)
  @Get()
  async getOrder() {
    return this.orderService.getOrderProducts();
  }

  @Roles(Role.Admin)
  @Get('User/:userId')
  async getOrderByUser(@ParamUserId() userId: number) {
    return this.orderService.getOrderProductsByUser(userId);
  }

  @Roles(Role.cliente)
  @Get('User')
  async getOrderUser(@User() userId: number, Delivered: boolean) {
    return this.orderService.getOrderUser(userId, Delivered);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async UpdateDeliveredProduct(@Paramid() id: number, @User() userId: number) {
    return this.orderService.DeliveredProduct(id, userId);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteOrder(@Paramid() id: number) {
    return this.orderService.DeleteOrder(id);
  }

  @Roles(Role.Admin)
  @Put('send-code/:userId')
  async TrackingCodeToUser(
    @Body() data: SendtrackingDto,
    @ParamUserId() userId: number,
  ) {
    return this.orderService.SendTrackingCode(data, userId);
  }
}
