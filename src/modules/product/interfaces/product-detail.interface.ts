import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateProductAttributeDto } from '../dto/product-attribute-value.dto';
import {
  ProductVariantValuesDto,
  ProductVariationListDto,
  ProductVariationValueListDto,
} from '../dto/product-variant.dto';
import { ProductDto } from '../dto/product.dto';
import { Expose } from 'class-transformer';

export class ProductVariationValueList extends ProductVariationValueListDto {}

export class ProductVariationList extends ProductVariationListDto {}

export class ProductVariantValues extends ProductVariantValuesDto {}

export class ProductDetailAttribute extends CreateProductAttributeDto {}

export class GetProductDetail extends OmitType(ProductDto, ['categoryIds' as const]) {
  @ApiProperty({ description: 'ID của sản phẩm' })
  id: number;

  @ApiProperty({
    name: 'category_ids',
    description: 'ID danh mục của sản phẩm (bao gồm quan hệ cha con)',
  })
  @Expose({ name: 'category_ids' })
  categoryIds: number[][];

  constructor(partial?: Partial<GetProductDetail>) {
    super();
    Object.assign(this, partial);
  }
}
