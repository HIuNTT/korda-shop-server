import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethod } from './entities/payment-method.entity';
import { IdParam } from '#/common/decorators/id-param.decorator';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { Public } from '#/modules/auth/decorators/public.decorator';

@Public()
@Controller('method')
export class PaymentMethodController {
  constructor(private paymentMethodService: PaymentMethodService) {}

  @Get()
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return this.paymentMethodService.getAll();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async createPaymentMethod(@Body() dto: PaymentMethodDto): Promise<void> {
    return this.paymentMethodService.create(dto);
  }

  @Put(':id')
  async updatePaymentMethod(@IdParam() id: number, @Body() dto: PaymentMethodDto): Promise<void> {
    return this.paymentMethodService.update(id, dto);
  }

  @Delete(':id')
  async deletePaymentMethod(@IdParam() id: number): Promise<void> {
    return this.paymentMethodService.delete(id);
  }
}
