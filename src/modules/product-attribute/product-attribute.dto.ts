import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ProductAttributeDto {
  @ApiProperty({ description: 'Tên thuộc tính' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ name: 'order_no', description: 'Thứ tự hiển thị thuộc tính', default: 0 })
  @Expose({ name: 'order_no' })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderNo?: number;

  @ApiProperty({ name: 'is_selected', description: 'Thuộc tính nổi bật', default: false })
  @Expose({ name: 'is_selected' })
  @IsBoolean()
  @IsOptional()
  isSelected?: boolean;

  @ApiProperty({ name: 'group_id', description: 'ID nhóm thuộc tính' })
  @Expose({ name: 'group_id' })
  @IsInt()
  @IsOptional()
  groupId?: number;
}
