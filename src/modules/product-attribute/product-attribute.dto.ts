import { InputType } from '#/constants/input-type.constant';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ProductAttributeDto {
  @ApiProperty({ description: 'Tên thuộc tính' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Key thuộc tính' })
  @IsNotEmpty()
  @IsString()
  key: string;

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

  @ApiProperty({ name: 'is_display', description: 'Thuộc tính hiển thị', default: true })
  @Expose({ name: 'is_display' })
  @IsBoolean()
  @IsOptional()
  isDisplay?: boolean;

  @ApiProperty({
    name: 'is_key_selling',
    description: 'Thuộc tính điểm bán hàng quan trọng',
    default: false,
  })
  @Expose({ name: 'is_key_selling' })
  @IsBoolean()
  @IsOptional()
  isKeySelling?: boolean;

  @ApiProperty({ name: 'is_filter', description: 'Thuộc tính dùng để lọc', default: false })
  @Expose({ name: 'is_filter' })
  @IsBoolean()
  @IsOptional()
  isFilter?: boolean;

  @ApiProperty({ name: 'is_required', description: 'Thuộc tính bắt buộc', default: false })
  @Expose({ name: 'is_required' })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiProperty({
    name: 'input_type',
    description: 'Loại nhập liệu',
    default: InputType.TEXT_FIELD,
    enum: InputType,
  })
  @Expose({ name: 'input_type' })
  @IsEnum(InputType)
  @IsOptional()
  inputType?: InputType;

  @ApiProperty({ description: 'Mô tả thuộc tính' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ name: 'group_id', description: 'ID nhóm thuộc tính' })
  @Expose({ name: 'group_id' })
  @IsInt()
  @IsOptional()
  groupId?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeOptionDto)
  options?: ProductAttributeOptionDto[];
}

export class ProductAttributeOptionDto {
  @ApiProperty({ description: 'Tên giá trị của thuộc tính' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mô tả giá trị của thuộc tính' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ name: 'order_no', description: 'Thứ tự hiển thị', default: 0 })
  @Expose({ name: 'order_no' })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderNo?: number;
}
