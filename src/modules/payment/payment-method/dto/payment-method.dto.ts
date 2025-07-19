import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class PaymentMethodImageDto {
  @ApiProperty({ description: 'Key ảnh trong cloud của phương thức thanh toán' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'URL của hình ảnh phương thức thanh toán' })
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class PaymentMethodDto {
  @ApiProperty({ description: 'Tên của phương thức thanh toán' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Tên key duy nhất của phương thức thanh toán' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Hình ảnh của phương thức thanh toán' })
  @ValidateNested()
  @Type(() => PaymentMethodImageDto)
  image: PaymentMethodImageDto;

  @ApiProperty({
    name: 'is_actived',
    description: 'Trạng thái kích hoạt của phương thức thanh toán',
    default: true,
  })
  @IsOptional()
  @Expose({ name: 'is_actived' })
  isActived?: boolean;

  @ApiProperty({
    name: 'order_no',
    description: 'Số thứ tự hiển thị của phương thức thanh toán',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Expose({ name: 'order_no' })
  orderNo?: number;
}
