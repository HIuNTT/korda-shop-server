import { CommonEntity } from '#/common/entity/common.entity';
import { Expose } from 'class-transformer';
import { Column, Entity } from 'typeorm';

@Entity()
export class ProductAttributeGroup extends CommonEntity {
  @Column({ comment: 'Tên nhóm thuộc tính' })
  name: string;

  @Expose({ name: 'order_no' })
  @Column({ nullable: true, default: 0, comment: 'Thứ tự hiển thị' })
  orderNo: number;
}
