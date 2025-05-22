import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

export class DefaultAttribute {
  @ApiProperty({ description: 'Tên thuộc tính' })
  name: string;

  @Exclude()
  orderNo: number;

  @ApiProperty({ description: 'Giá trị thuộc tính' })
  value: string;
}
export class AttributeHashMap {
  @ApiProperty({ description: 'ID thuộc tính' })
  id: number;

  @ApiProperty({ description: 'Tên thuộc tính' })
  name: string;

  @Exclude()
  orderNo: number;

  @ApiProperty({ description: 'Giá trị thuộc tính' })
  value: string;
}

export class AttributeGroupHasMap {
  @ApiProperty({ name: 'group_name', description: 'Tên nhóm thuộc tính' })
  @Expose({ name: 'group_name' })
  groupName: string;

  @Exclude()
  orderNo: number;

  @ApiProperty({
    description: 'Danh sách thuộc tính thuộc nhóm',
    type: [AttributeHashMap],
  })
  @Type(() => AttributeHashMap)
  attributes: AttributeHashMap[];
}
