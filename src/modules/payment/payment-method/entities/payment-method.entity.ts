import { CommonEntity } from '#/common/entity/common.entity';
import { Expose } from 'class-transformer';
import { Column, Entity } from 'typeorm';

@Entity()
export class PaymentMethod extends CommonEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  key: string;

  @Expose({ name: 'image_url' })
  @Column()
  imageUrl: string;

  @Column({ default: true })
  @Expose({ name: 'is_actived' })
  isActived: boolean;

  @Expose({ name: 'order_no' })
  @Column({ default: 0 })
  orderNo: number;
}
