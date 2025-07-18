import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { CreateOrderDto, GetOrderInfoDto } from './dto/order.dto';
import { Ip } from '#/common/decorators/http.decorator';
import { CreateOrderRes } from './interfaces/order.interface';
import { Order } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createOrder(
    @AuthUser() user: IAuthUser,
    @Ip() ip: string,
    @Body() dto: CreateOrderDto,
  ): Promise<CreateOrderRes> {
    return this.orderService.createOrder(user.uid, ip, dto);
  }

  @Get('info')
  async getOrderInfo(@AuthUser() user: IAuthUser, @Query() dto: GetOrderInfoDto): Promise<Order> {
    return await this.orderService.getOneOrderByCode(user.uid, dto.orderCode);
  }
}
