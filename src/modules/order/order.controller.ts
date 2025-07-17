import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { CreateOrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createOrder(@AuthUser() user: IAuthUser, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(user.uid, dto);
  }
}
