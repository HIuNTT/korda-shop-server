import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose({ name: 'image_url' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @Expose({ name: 'parent_id' })
  @IsInt()
  @IsOptional()
  parentId?: number;

  @Expose({ name: 'order_no' })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderNo?: number;

  @IsString()
  @IsOptional()
  slug?: string;
}

export class CategoryQueryDto {
  /** Tên danh mục */
  @IsString()
  @IsOptional()
  name?: string;
}
