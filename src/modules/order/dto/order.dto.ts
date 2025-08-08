import { PagerDto } from '#/common/dto/pager.dto';
import { OrderStatusType } from '#/constants/status.constant';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @Expose({ name: 'address_id' })
  @ApiProperty({
    name: 'address_id',
    description: 'ID của địa chỉ giao hàng',
  })
  @IsInt()
  @Min(1)
  addressId: number;

  @ApiProperty({ description: 'Ghi chú cho đơn hàng' })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ name: 'payment_method_id', description: 'ID của phương thức thanh toán' })
  @Expose({ name: 'payment_method_id' })
  @IsInt()
  @Min(1)
  paymentMethodId: number;

  @Expose({ name: 'quote_id' })
  @ApiProperty({ name: 'quote_id', description: 'ID của bản nháp đơn hàng' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  quoteId: string;
}

export class GetOrderInfoDto {
  @ApiProperty({ name: 'order_code', description: 'Mã đơn hàng' })
  @Expose({ name: 'order_code' })
  @IsString()
  @IsNotEmpty()
  orderCode: string;
}

export class MyOrderQueryDto extends PagerDto {
  @ApiProperty({ enum: OrderStatusType })
  @IsEnum(OrderStatusType)
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value), { toClassOnly: true })
  type?: OrderStatusType;
}
