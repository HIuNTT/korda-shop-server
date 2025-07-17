import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

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
