import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsString } from 'class-validator';

export class QuoteDto {
  @ApiProperty({
    name: 'selected_ids',
    type: [String],
    description: 'Danh sách cart item được chọn để tạo bản nháp order',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Expose({ name: 'selected_ids' })
  selectedIds: string[];
}
