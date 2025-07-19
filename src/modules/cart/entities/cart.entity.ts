import { CommonEntity } from '#/common/entity/common.entity';
import { User } from '#/modules/user/entities/user.entity';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Cart extends CommonEntity {
  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Expose({ name: 'cart_items' })
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];
}
