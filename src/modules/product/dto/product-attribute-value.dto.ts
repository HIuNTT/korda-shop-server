import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ProductAttributeValueDto {
  @ApiProperty({ name: 'option_id', description: 'ID của tùy chọn thuộc tính', example: 1 })
  @Expose({ name: 'option_id' })
  @IsInt()
  @IsOptional()
  optionId?: number;

  @ApiProperty({ name: 'raw_value', description: 'Giá trị dạng chuỗi' })
  @Expose({ name: 'raw_value' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  rawValue?: string;
}

export class CreateProductAttributeDto {
  @ApiProperty({ name: 'attribute_id', description: 'ID của thuộc tính sản phẩm', example: 1 })
  @Expose({ name: 'attribute_id' })
  @IsInt()
  attributeId: number;

  @ApiProperty({
    name: 'attribute_values',
    description: 'Các giá trị thuộc tính',
    type: [ProductAttributeValueDto],
  })
  @Expose({ name: 'attribute_values' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeValueDto)
  attributeValues: ProductAttributeValueDto[];
}
