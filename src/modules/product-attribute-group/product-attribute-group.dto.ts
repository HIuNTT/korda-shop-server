import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
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
}
