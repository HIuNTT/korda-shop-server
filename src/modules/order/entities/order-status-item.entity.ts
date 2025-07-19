import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { Order } from './order.entity';
import { OrderStatus } from './order-status.entity';
import { Expose } from 'class-transformer';

@Entity()
export class OrderStatusItem {
  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  statusId: number;

  @Column()
  isLatest: boolean;

  @Expose({ name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Order, {
    onDelete: 'CASCADE',
  })
  order: Relation<Order>;

  @ManyToOne(() => OrderStatus)
  status: OrderStatus;
}
