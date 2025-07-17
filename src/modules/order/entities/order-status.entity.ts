import { CommonEntity } from '#/common/entity/common.entity';
import { OrderStatusType } from '#/constants/status.constant';
import { Column, Entity, OneToMany } from 'typeorm';
import { OrderStatusItem } from './order-status-item.entity';

@Entity()
export class OrderStatus extends CommonEntity {
  @Column({ type: 'enum', enum: OrderStatusType })
  name: OrderStatusType;

  @OneToMany(() => OrderStatusItem, (item) => item.status)
  statusItems: OrderStatusItem[];
}
