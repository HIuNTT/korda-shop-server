import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProductVariantOptionDto {
  @ApiProperty({ description: 'Tên của tùy chọn biến thể sản phẩm', example: 'Đen' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ name: 'order_no' })
  @Expose({ name: 'order_no' })
  @IsInt()
  @IsOptional()
  orderNo?: number;
}

export class ProductVariantTypeDto {
  @ApiProperty({ description: 'Tên của loại biến thể sản phẩm', example: 'Màu sắc' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Danh sách các tùy chọn biến thể sản phẩm',
    type: [ProductVariantOptionDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantOptionDto)
  options: ProductVariantOptionDto[];
}
