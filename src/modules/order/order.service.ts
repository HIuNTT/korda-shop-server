import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, MyOrderQueryDto } from './dto/order.dto';
import { UserService } from '../user/user.service';
import { isEmpty, isNil } from 'lodash';
import { UserAddressService } from '../account/user-address/user-address.service';
import { PaymentMethodService } from '../payment/payment-method/payment-method.service';
import { QuoteService } from './services/quote.service';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, In, Repository } from 'typeorm';
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
import {
  CreateOrderRes,
  MyOrder,
  MyOrderDetail,
  MyOrderItem,
  MyOrderProcessing,
  OrderFlags,
} from './interfaces/order.interface';
import { dateFormat } from 'vnpay';
import { IVnpayConfig, VnpayConfig } from '#/config/vnpay.config';
import { ProductVariant } from '../product-variant/entities/product-variant.entity';
import { Product } from '../product/entities/product.entity';
import { VnpayService } from 'nestjs-vnpay';
import { InjectVnpay } from '#/common/decorators/inject-vnpay.decorator';
import { ITransferConfig, TransferConfig } from '#/config/transfer.config';
import { paginate } from '#/helper/paginate';
import { Pagination } from '#/helper/paginate/pagination';

@Injectable()
export class OrderService {
  constructor(
    private userService: UserService,
    private userAddressService: UserAddressService,
    private paymentMethodService: PaymentMethodService,
    private quoteService: QuoteService,
    @InjectVnpay() private readonly vnpayService: VnpayService,
    @InjectRepository(OrderStatus) private orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectEntityManager() private entityManager: EntityManager,
    @Inject(VnpayConfig.KEY) private vnpayConfig: IVnpayConfig,
    @Inject(TransferConfig.KEY) private transferConfig: ITransferConfig,
  ) {}

  async getMyOrders(
    { page, take, type, keyword }: MyOrderQueryDto,
    userId: number,
  ): Promise<Pagination<MyOrder>> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.statusItems', 'statusItem', 'statusItem.isLatest = :isLatest', {
        isLatest: true,
      })
      .leftJoinAndSelect('statusItem.status', 'status')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoin('orderItem.product', 'product')
      .addSelect(['product.imageUrl', 'product.name', 'product.stock', 'product.id'])
      .leftJoin('product.product', 'productInfo')
      .addSelect(['productInfo.name', 'productInfo.thumbnailUrl', 'productInfo.id'])
      .leftJoinAndSelect('product.variantValues', 'variantValues')
      .leftJoin('order.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('order.createdAt', 'DESC');

    if (!isNil(type)) {
      queryBuilder.andWhere('status.name = :type', { type });
    }

    if (!isNil(keyword)) {
      queryBuilder.andWhere({ code: ILike(`${keyword}`) });
      queryBuilder.orWhere(
        `to_tsvector('simple', productInfo.name) @@ plainto_tsquery('simple', :keyword)`,
        { keyword },
      );
    }

    return paginate(queryBuilder, { page, take }, (data) =>
      data.map((item) => {
        let count = 0;

        const flags: OrderFlags = {};

        switch (item.statusItems[0].status.name) {
          case OrderStatusType.AWAITING_PAYMENT:
            flags.isRepayment = true;
            flags.isCancel = true;
            break;
          case OrderStatusType.AWAITING_CONFIRMATION:
            flags.isCancel = true;
            break;
          case OrderStatusType.CONFIRMED:
            flags.isCancel = true;
            break;
          case OrderStatusType.DELIVERING:
            flags.isReturn = false;
            break;
          case OrderStatusType.COMPLETED:
            flags.isReBuy = true;
            flags.isReview = true;
            flags.isReturn = true;
            break;
          case OrderStatusType.CANCELED:
            flags.isReBuy = true;
            break;
        }

        const details: MyOrderItem[] = item.orderItems.map((orderItem) => {
          count += orderItem.quantity;

          return {
            itemId: orderItem.product.product.id,
            variantId: orderItem.product.id,
            quantity: orderItem.quantity,
            price: orderItem.price,
            originalPrice: orderItem.originalPrice,
            imageUrl: orderItem.product.imageUrl || orderItem.product.product.thumbnailUrl,
            itemName: orderItem.product.product.name,
            stock: orderItem.product.stock,
            variantName: orderItem.product.variantValues.map((variant) => variant.name).join(', '),
          };
        });

        return new MyOrder({
          id: item.id,
          code: item.code,
          subtotalPrice: item.subtotalPrice,
          totalPrice: item.totalPrice,
          shippingPrice: item.shippingPrice,
          voucherPrice: item.voucherPrice,
          createdAt: item.createdAt,
          status: item.statusItems[0].status.name,
          count,
          details,
          flags,
        });
      }),
    );
  }

  async getMyOrderById(orderId: number, userId: number): Promise<MyOrderDetail> {
    const order = await this.orderRepository.findOneOrFail({
      where: { id: orderId, user: { id: userId } },
      relations: {
        statusItems: {
          status: true,
        },
        orderItems: {
          product: {
            product: true,
            variantValues: true,
          },
        },
        paymentMethod: true,
        shippingAddress: {
          province: true,
          district: true,
          ward: true,
        },
      },
      order: {
        statusItems: {
          createdAt: 'DESC',
        },
      },
    });

    console.log('shippingAddress', order.statusItems);

    const statusLatest = order.statusItems.find((item) => item.isLatest) || order.statusItems[0];

    const flags: OrderFlags = {};

    switch (statusLatest.status.name) {
      case OrderStatusType.AWAITING_PAYMENT:
        flags.isRepayment = true;
        flags.isCancel = true;
        break;
      case OrderStatusType.AWAITING_CONFIRMATION:
        flags.isCancel = true;
        break;
      case OrderStatusType.CONFIRMED:
        flags.isCancel = true;
        break;
      case OrderStatusType.DELIVERING:
        flags.isReturn = false;
        break;
      case OrderStatusType.COMPLETED:
        flags.isReBuy = true;
        flags.isReview = true;
        flags.isReturn = true;
        break;
      case OrderStatusType.CANCELED:
        flags.isReBuy = true;
        break;
    }

    const processing: MyOrderProcessing = {
      createTime: order.createdAt,
    };

    order.statusItems.forEach((statusItem) => {
      switch (statusItem.status.name) {
        case OrderStatusType.CONFIRMED:
          processing.confirmTime = statusItem.createdAt;
          break;
        case OrderStatusType.DELIVERING:
          processing.deliveryTime = statusItem.createdAt;
          break;
        case OrderStatusType.COMPLETED:
          processing.completeTime = statusItem.createdAt;
          break;
        case OrderStatusType.CANCELED:
          processing.cancelTime = statusItem.createdAt;
          break;
      }
    });

    return new MyOrderDetail({
      id: order.id,
      code: order.code,
      note: order.note,
      subtotalPrice: order.subtotalPrice,
      totalPrice: order.totalPrice,
      shippingPrice: order.shippingPrice,
      voucherPrice: order.voucherPrice,
      createdAt: order.createdAt,
      status: statusLatest.status.name,
      products: order.orderItems.map((item) => ({
        productId: item.product.product.id,
        variantId: item.product.id,
        quantity: item.quantity,
        price: item.price,
        originalPrice: item.originalPrice,
        imageUrl: item.product.imageUrl || item.product.product.thumbnailUrl,
        productName: item.product.product.name,
        stock: item.product.stock,
        variantName: item.product.variantValues.map((variant) => variant.name).join(', '),
        slug: item.product.product.slug,
      })),
      flags,
      address: {
        shippingName: order.shippingAddress.name,
        shippingPhone: order.shippingAddress.phone,
        shippingAddress: [
          order.shippingAddress.address,
          order.shippingAddress.ward.name,
          order.shippingAddress.district.name,
          order.shippingAddress.province.name,
        ].join(', '),
      },
      paymentMethod: {
        id: order.paymentMethod.id,
        name: order.paymentMethod.name,
        key: order.paymentMethod.key,
        imageUrl: order.paymentMethod.imageUrl,
      },
      processing,
    });
  }

  async createOrder(
    userId: number,
    ip: string,
    { addressId, paymentMethodId, quoteId, note }: CreateOrderDto,
  ): Promise<CreateOrderRes> {
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

    return await this.entityManager.transaction(async (manager) => {
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

      const orderStatusItem = new OrderStatusItem();
      orderStatusItem.order = savedOrder;
      orderStatusItem.isLatest = true;
      if (paymentMethod.key === PaymentMethodType.COD) {
        orderStatusItem.status = await manager.findOneOrFail(OrderStatus, {
          where: { name: OrderStatusType.AWAITING_CONFIRMATION },
        });
      } else {
        orderStatusItem.status = await manager.findOneOrFail(OrderStatus, {
          where: { name: OrderStatusType.AWAITING_PAYMENT },
        });
      }
      await manager.save(orderStatusItem);

      // Clear the quote and cart item after order creation
      await this.quoteService.delete(userId, quoteId);
      const cart = await manager.findOneOrFail(Cart, {
        where: { user: { id: userId } },
      });
      const cartItems = await manager.find(CartItem, {
        where: { cart: { id: cart.id }, productId: In(quoteItems.map((item) => item.productId)) },
      });
      await manager.remove(cartItems);

      let paymentUrl: string = undefined;
      if (paymentMethod.key === PaymentMethodType.VNPAY) {
        paymentUrl = this.vnpayService.instance.buildPaymentUrl({
          vnp_Amount: subtotalPrice,
          vnp_TxnRef: generateRandomValue(16),
          vnp_IpAddr: ip,
          vnp_OrderInfo: orderCode,
          vnp_ReturnUrl: this.vnpayConfig.returnUrl,
          vnp_ExpireDate: dateFormat(dayjs().add(5, 'minute').toDate()),
        });
      }

      let qrCode: string = undefined;
      if (paymentMethod.key === PaymentMethodType.TRANSER_ONLINE) {
        qrCode = `${this.transferConfig.qrCodePrefix}?acc=${this.transferConfig.account}&bank=${this.transferConfig.bankName}&amount=${2000}&des=${orderCode}`;
      }

      return new CreateOrderRes({
        orderCode,
        totalPrice: savedOrder.totalPrice,
        paymentMethod: paymentMethod,
        paymentUrl,
        qrCode,
      });
    });
  }

  async updateOrderStatus(orderCode: string, status: OrderStatusType, userId?: number) {
    if (userId) {
      const user = await this.userService.findUserById(userId);
      if (isEmpty(user)) {
        throw new NotFoundException('Không tìm thấy người dùng');
      }
    }
    const order = await this.orderRepository.findOneOrFail({
      where: { code: orderCode, user: { id: userId } },
      relations: {
        statusItems: {
          status: true,
        },
        orderItems: {
          product: {
            product: true,
          },
        },
      },
      order: {
        statusItems: { createdAt: 'DESC' },
      },
    });

    if (isEmpty(order)) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    const currentStatusItem = order.statusItems.find((item) => item.isLatest);
    if (currentStatusItem.status.name === status) {
      throw new ConflictException('Trạng thái đơn hàng đã được cập nhật');
    }

    if (
      status === OrderStatusType.CANCELED &&
      ![OrderStatusType.AWAITING_CONFIRMATION, OrderStatusType.AWAITING_PAYMENT].includes(
        currentStatusItem.status.name,
      )
    ) {
      throw new ConflictException(
        'Không thể hủy đơn hàng khi đơn hàng đã được xác nhận hoặc đã thanh toán',
      );
    }

    const newStatus = await this.orderStatusRepository.findOneOrFail({
      where: { name: status },
    });

    await this.entityManager.transaction(async (manager) => {
      currentStatusItem.isLatest = false;
      await manager.save(currentStatusItem);

      if (status === OrderStatusType.CANCELED) {
        // If the order is canceled, we need to revert stock for each product in the order
        for (const item of order.orderItems) {
          await manager.increment(ProductVariant, { id: item.product.id }, 'stock', item.quantity);
          await manager.increment(Product, { id: item.product.product.id }, 'stock', item.quantity);
        }
      }

      if (status === OrderStatusType.COMPLETED) {
        // If the order is completed, we can also update the quantity sold for each product in the order
        for (const item of order.orderItems) {
          await manager.increment(
            Product,
            { id: item.product.product.id },
            'quantitySold',
            item.quantity,
          );
        }
      }

      const newStatusItem = manager.create(OrderStatusItem, {
        order,
        status: newStatus,
        isLatest: true,
      });
      await manager.save(newStatusItem);
    });
  }

  async getOrderStatusCheckPayment(userId: number, orderCode: string): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      where: { code: orderCode, user: { id: userId } },
      relations: {
        statusItems: {
          status: true,
        },
      },
      order: {
        statusItems: { createdAt: 'DESC' },
      },
    });

    if (isEmpty(order)) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    if (
      order.statusItems.length === 1 &&
      order.statusItems[0].status.name === OrderStatusType.AWAITING_PAYMENT
    ) {
      return false; // Chưa thanh toán
    }

    if (order.statusItems.length > 1) {
      const latestStatus = order.statusItems[0].status.name;
      if (latestStatus === OrderStatusType.CONFIRMED) {
        return true; // Đã thanh toán
      } else if (latestStatus === OrderStatusType.CANCELED) {
        throw new ConflictException('Đơn hàng đã bị hủy');
      } else {
        return false; // Trạng thái khác, không phải là đã thanh toán
      }
    }
  }

  async getOneOrderByCode(userId: number, orderCode: string): Promise<Order> {
    const user = await this.userService.findUserById(userId);
    if (isEmpty(user)) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const order = await this.orderRepository.findOne({
      where: { code: orderCode, user: { id: userId } },
      relations: {
        statusItems: {
          status: true,
        },
        paymentMethod: true,
      },
      order: {
        statusItems: { createdAt: 'DESC' },
      },
    });

    if (isEmpty(order)) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    const currStatus = order.statusItems.find((item) => item.isLatest);
    order.statusItems = [currStatus];

    return order;
  }

  async getOrderToCheckPayment(orderCode: string, totalPrice: number): Promise<Order> {
    return await this.orderRepository.findOne({
      where: {
        code: orderCode,
        // totalPrice: totalPrice,
        statusItems: { isLatest: true, status: { name: OrderStatusType.AWAITING_PAYMENT } },
      },
    });
  }

  private generateOrderCode(): string {
    const dateTime = dayjs().format('YYYYMMDD');
    const randomValue = generateRandomValue(8, 'QWERTYUIOPASDFGHJKLZXCVBNM0123456789');
    return `${dateTime}${randomValue}`;
  }
}
