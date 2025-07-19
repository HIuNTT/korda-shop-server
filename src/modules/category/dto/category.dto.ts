import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CategoryDto {
  @ApiProperty({ description: 'Tên danh mục' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ name: 'image_url', description: 'Ảnh danh mục' })
  @Expose({ name: 'image_url' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ name: 'parent_id', description: 'ID danh mục cha' })
  @Expose({ name: 'parent_id' })
  @IsInt()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ name: 'order_no', description: 'Thứ tự hiển thị danh mục', default: 0 })
  @Expose({ name: 'order_no' })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderNo?: number;

  @ApiProperty({ description: 'Slug danh mục' })
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
