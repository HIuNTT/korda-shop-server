import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductAttributeGroupDto {
  /**
   * Tên nhóm thuộc tính
   * @example 'Bộ xử lý & Đồ họa
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ name: 'order_no' })
  @Expose({ name: 'order_no' })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderNo?: number;

  @ApiProperty({ name: 'is_filter', default: false, description: 'Nhóm thuộc tính dùng để lọc' })
  @Expose({ name: 'is_filter' })
  @IsOptional()
  @IsBoolean()
  isFilter?: boolean;

  @ApiProperty({ name: 'category_ids', type: [Number] })
  @Expose({ name: 'category_ids' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  categoryIds: number[];
}
