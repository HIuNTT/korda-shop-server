import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { CreateOrderDto, GetOrderInfoDto, MyOrderQueryDto } from './dto/order.dto';
import { Ip } from '#/common/decorators/http.decorator';
import { CreateOrderRes, MyOrder, MyOrderDetail } from './interfaces/order.interface';
import { Order } from './entities/order.entity';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Pagination } from '#/helper/paginate/pagination';
import { IdParam } from '#/common/decorators/id-param.decorator';

@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('my-order')
  async getMyOrders(
    @AuthUser() user: IAuthUser,
    @Query() dto: MyOrderQueryDto,
  ): Promise<Pagination<MyOrder>> {
    return this.orderService.getMyOrders(dto, user.uid);
  }

  @Get('my-order-detail/:id')
  async getMyOrderById(@AuthUser() user: IAuthUser, @IdParam() id: number): Promise<MyOrderDetail> {
    return await this.orderService.getMyOrderById(id, user.uid);
  }

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

  @SkipThrottle()
  @Get('payment/:code')
  async getOrderStatusCheckPayment(@AuthUser() user: IAuthUser, @Param('code') code: string) {
    return {
      status: await this.orderService.getOrderStatusCheckPayment(user.uid, code),
    };
  }
}
