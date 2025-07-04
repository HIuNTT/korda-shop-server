import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ name: 'item_id', description: 'ID cart_item cần cập nhật số lượng' })
  @Expose({ name: 'item_id' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'Số lượng mới của sản phẩm trong giỏ hàng' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartDto {
  @ApiProperty({ description: 'Cart_item đượ cập nhật' })
  @Type(() => UpdateCartItemDto)
  @ValidateNested({ each: true })
  item: UpdateCartItemDto;

  @ApiProperty({
    name: 'selected_ids',
    description: 'ID của các sản phẩm được chọn',
    type: [String],
  })
  @Expose({ name: 'selected_ids' })
  @IsString({ each: true })
  @IsArray()
  selectedIds: string[];
}

export class ToggleCartItemDto extends PickType(UpdateCartDto, ['selectedIds' as const]) {}

export class DeleteCartItemDto {
  @ApiProperty({ description: 'Danh sách ID cart_item cần xóa', type: [String] })
  @IsString({ each: true })
  @IsArray()
  ids: string[];

  @ApiProperty({
    name: 'selected_ids',
    description: 'ID của các sản phẩm được chọn, không tính các sản phẩm được xóa',
    type: [String],
  })
  @Expose({ name: 'selected_ids' })
  @IsString({ each: true })
  @IsArray()
  selectedIds: string[];
}

export class ReplaceCartItemDto {
  @ApiProperty({ description: 'ID của cart_item cần thay thế' })
  @Expose({ name: 'item_id' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'ID của biến thể mới của sản phẩm' })
  @Expose({ name: 'new_variant_id' })
  @IsInt()
  newVariantId: number;

  @ApiProperty({
    name: 'selected_ids',
    description: 'ID của các sản phẩm được chọn',
    type: [String],
  })
  @Expose({ name: 'selected_ids' })
  @IsString({ each: true })
  @IsArray()
  selectedIds: string[];
}
