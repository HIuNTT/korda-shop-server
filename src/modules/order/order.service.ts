import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { UserService } from '../user/user.service';
import { isEmpty } from 'lodash';
import { UserAddressService } from '../account/user-address/user-address.service';
import { PaymentMethodService } from '../payment/payment-method/payment-method.service';
import { QuoteService } from './services/quote.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import dayjs from 'dayjs';
import { generateRandomValue } from '#/utils/tool.util';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { PaymentMethodType } from '#/constants/payment.constant';
import { OrderStatusItem } from './entities/order-status-item.entity';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusType } from '#/constants/status.constant';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';

@Injectable()
export class OrderService {
  constructor(
    private userService: UserService,
    private userAddressService: UserAddressService,
    private paymentMethodService: PaymentMethodService,
    private quoteService: QuoteService,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async createOrder(userId: number, { addressId, paymentMethodId, quoteId, note }: CreateOrderDto) {
    const user = await this.userService.findUserById(userId);
    if (isEmpty(user)) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const address = await this.userAddressService.findOneById(userId, addressId);
    const paymentMethod = await this.paymentMethodService.findOneById(paymentMethodId);
    const quote = await this.quoteService.findQuoteById(userId, quoteId);
    if (isEmpty(quote)) {
      throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
    }
    const quoteItems = await this.quoteService.findQuoteItemByQuoteId(quoteId);

    await this.entityManager.transaction(async (manager) => {
      const subtotalPrice = quoteItems.reduce((total, curr) => {
        if (curr.quantity > curr.product.stock) {
          throw new ConflictException(
            `Sản phẩm ${curr.product.name.trim()} không đủ số lượng trong kho`,
          );
        }
        return total + curr.quantity * curr.product.price;
      }, 0);

      const orderCode = this.generateOrderCode();

      const order = manager.create(Order, {
        code: orderCode,
        note,
        subtotalPrice,
        totalPrice: subtotalPrice,
        shippingPrice: 0, // Assuming shipping price is 0 for now, can be updated later
        voucherPrice: 0, // Assuming no voucher applied, can be updated later
        paymentMethod,
        user,
        shippingAddress: {
          name: address.name,
          phone: address.phone,
          address: address.address,
          type: address.type,
          province: address.province,
          district: address.district,
          ward: address.ward,
        },
      });

      const savedOrder = await manager.save(order);

      const orderItems = quoteItems.map((item) =>
        manager.create(OrderItem, {
          order: savedOrder,
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
        }),
      );
      await manager.save(orderItems);

      if (paymentMethod.key === PaymentMethodType.COD) {
        const orderStatusItem = new OrderStatusItem();
        orderStatusItem.order = savedOrder;
        orderStatusItem.isLatest = true;
        orderStatusItem.status = await manager.findOneOrFail(OrderStatus, {
          where: { name: OrderStatusType.AWAITING_CONFIRMATION },
        });
        await manager.save(orderStatusItem);
      }

      // Clear the quote and cart item after order creation
      await this.quoteService.delete(userId, quoteId);
      const cart = await manager.findOneOrFail(Cart, {
        where: { user: { id: userId } },
      });
      const cartItems = await manager.find(CartItem, {
        where: { cart: { id: cart.id }, productId: In(quoteItems.map((item) => item.productId)) },
      });
      await manager.remove(cartItems);
    });
  }

  private generateOrderCode(): string {
    const dateTime = dayjs().format('YYYYMMDD');
    const randomValue = generateRandomValue(8, 'QWERTYUIOPASDFGHJKLZXCVBNM0123456789');
    return `${dateTime}${randomValue}`;
  }
}
