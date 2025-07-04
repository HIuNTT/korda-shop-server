import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductImageDto } from './product-image.dto';

export class VariantImageDto extends OmitType(ProductImageDto, ['orderNo' as const]) {}

export class ProductVariantValuesDto {
  @ApiProperty({ description: 'Giá sản phẩm' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Giá gốc sản phẩm', name: 'original_price' })
  @Expose({ name: 'original_price' })
  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @ApiProperty({ description: 'Số lượng sản phẩm trong kho' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    name: 'index_map',
    description:
      'Mảng ánh xạ thứ tự các tùy chọn biến thể, nếu 1 loại biến thể thì 1 phần tử, 2 loại biến thể thì 2 phần tử',
  })
  @Expose({ name: 'index_map' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  indexMap: number[];

  @ApiProperty({
    name: 'variant_id',
    description: 'ID của biến thể sản phẩm, bằng 0 khi tạo sản phẩm mới',
  })
  @Expose({ name: 'variant_id' })
  @IsInt()
  @Min(0)
  variantId: number;

  @ApiProperty({
    description: 'Hình ảnh đại diện cho biến thể sản phẩm',
    type: VariantImageDto,
  })
  @Type(() => VariantImageDto)
  @ValidateNested()
  @IsOptional()
  image?: VariantImageDto;
}

export class ProductVariationValueListDto {
  @ApiProperty({
    name: 'value_id',
    description: 'ID của giá trị tùy chọn biến thể, nếu đã tồn tại ở CSDL',
  })
  @Expose({ name: 'value_id' })
  @IsInt()
  @Min(0)
  valueId: number;

  @ApiProperty({ name: 'custom_value', description: 'Giá trị tùy chỉnh của biến thể' })
  @Expose({ name: 'custom_value' })
  @IsString()
  customValue: string;
}

export class ProductVariationListDto {
  @ApiProperty({ name: 'type_id', description: 'ID của loại biến thể, nếu đã tồn tại ở CSDL' })
  @Expose({ name: 'type_id' })
  @IsInt()
  @Min(0)
  typeId: number;

  @ApiProperty({
    name: 'custom_value',
    description: 'Giá trị tùy chỉnh của loại biến thể, được nhập nếu chưa có ở CSDL',
  })
  @Expose({ name: 'custom_value' })
  @IsString()
  customValue: string;

  @ApiProperty({ name: 'value_list', description: 'Danh sách các giá trị tùy chọn biến thể' })
  @Expose({ name: 'value_list' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductVariationValueListDto)
  valueList: ProductVariationValueListDto[];
}
