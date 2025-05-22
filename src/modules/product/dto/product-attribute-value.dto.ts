import { IsInt, IsString } from 'class-validator';

export class ProductAttributeValueDto {
  /**
   * ID của thuộc tính sản phẩm
   * @example 1
   */
  @IsInt()
  id: number;

  /**
   * Giá trị của thuộc tính sản phẩm
   * @example "512GB"
   */
  @IsString()
  value: string;
}
