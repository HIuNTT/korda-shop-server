import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProductImageDto {
  @ApiProperty({ description: 'Url của hình ảnh', example: 'https://example.com/image.jpg' })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({ name: 'order_no', description: 'Thứ tự hiển thị', example: 1 })
  @IsInt()
  @IsOptional()
  orderNo?: number;
}
