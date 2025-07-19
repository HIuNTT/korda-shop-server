import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProductGroupDto {
  @ApiProperty({ description: 'Tên nhóm sản phẩm' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
