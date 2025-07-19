import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CartItemDto {
  @ApiProperty({ name: 'item_id', description: 'ID biến thể sản phẩm được thêm vô giỏ hàng' })
  @Expose({ name: 'item_id' })
  @IsInt()
  itemId: number;

  @ApiProperty({ description: 'Số lượng của sản phẩm được thêm vô giỏ hàng' })
  @IsNumber()
  @Min(1)
  quantity: number;
}
