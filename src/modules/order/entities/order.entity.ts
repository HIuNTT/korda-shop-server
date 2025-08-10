import { CommonEntity } from '#/common/entity/common.entity';
import { User } from '#/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { OrderStatusItem } from './order-status-item.entity';
import { Expose } from 'class-transformer';
import { ShippingAddress } from './shipping-address.entity';
import { OrderItem } from './order-item.entity';
import { PaymentMethod } from '#/modules/payment/payment-method/entities/payment-method.entity';

@Entity()
export class Order extends CommonEntity {
  @Column({ unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Expose({ name: 'subtotal_price' })
  @Column()
  subtotalPrice: number;

  @Expose({ name: 'total_price' })
  @Column()
  totalPrice: number;

  @Expose({ name: 'shipping_price' })
  @Column()
  shippingPrice: number;

  @Expose({ name: 'voucher_price' })
  @Column()
  voucherPrice: number;

  @ManyToOne(() => User)
  user: User;

  @Expose({ name: 'shipping_address' })
  @OneToOne(() => ShippingAddress, (shippingAddress) => shippingAddress.order, { cascade: true })
  shippingAddress: ShippingAddress;

  @Expose({ name: 'status_items' })
  @OneToMany(() => OrderStatusItem, (item) => item.order)
  statusItems: OrderStatusItem[];

  @Expose({ name: 'order_items' })
  @OneToMany(() => OrderItem, (item) => item.order)
  orderItems: OrderItem[];

  @Expose({ name: 'payment_method' })
  @ManyToOne(() => PaymentMethod)
  paymentMethod: PaymentMethod;
}
