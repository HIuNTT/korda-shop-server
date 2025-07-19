import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { In, Repository } from 'typeorm';
import { CartItemDto } from './dto/cart.dto';
import { UserService } from '../user/user.service';
import { ProductVariant } from '../product-variant/entities/product-variant.entity';
import { CartItem } from './entities/cart-item.entity';
import { isEmpty } from 'lodash';
import { CartProduct } from './interfaces/cart-item.interface';
import { CartInfo, CartPrices } from './interfaces/cart.interface';
import {
  DeleteCartItemDto,
  ReplaceCartItemDto,
  ToggleCartItemDto,
  UpdateCartDto,
} from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
    @InjectRepository(ProductVariant) private productVariantRepository: Repository<ProductVariant>,
    private userService: UserService,
  ) {}

  async addToCart(userId: number, { itemId, quantity }: CartItemDto): Promise<{ id: string }> {
    const item = await this.productVariantRepository.findOneByOrFail({ id: itemId });
    if (item.stock < quantity) {
      throw new ConflictException('Số lượng sản phẩm không đủ trong kho');
    }

    let cart = await this.cartRepository.findOneBy({ user: { id: userId } });
    cart = await this.cartRepository.save({
      ...cart,
      user: await this.userService.findUserById(userId),
    });

    const cartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId: item.id },
    });

    if (!isEmpty(cartItem) && cartItem.quantity + quantity > item.stock) {
      throw new ConflictException('Số lượng sản phẩm không đủ trong kho');
    }
    const saved = await this.cartItemRepository.save({
      ...cartItem,
      cart,
      quantity: cartItem ? cartItem.quantity + quantity : quantity,
      product: item,
    });

    return { id: saved.id };
  }

  async getCartInfo(userId: number): Promise<CartInfo> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: {
        cartItems: {
          product: {
            product: true,
          },
        },
      },
      order: {
        cartItems: {
          updatedAt: 'DESC',
        },
      },
    });

    if (isEmpty(cart)) return null; // Chưa có giỏ hàng, trả về null

    return new CartInfo({
      products: await this.formatedCartItems(cart.cartItems),
      prices: {
        totalDiscount: 0,
        total: 0,
        totalVoucherPrice: 0,
        estimatedPrice: 0,
      },
    });
  }

  /** Cập nhật 1 cart item, kèm các item đã được selected để tính tổng tiền */
  async updateCartItemQuantity(
    userId: number,
    { item, selectedIds }: UpdateCartDto,
  ): Promise<CartInfo> {
    const cartItem = await this.cartItemRepository.findOneOrFail({
      where: { id: item.itemId, cart: { user: { id: userId } } },
      relations: {
        product: true,
      },
    });

    if (item.quantity > cartItem.product.stock) {
      throw new ConflictException('Số lượng sản phẩm không đủ trong kho');
    }

    await this.cartItemRepository.save({
      ...cartItem,
      quantity: item.quantity,
    });

    return await this.getCartInfoWithPrices(userId, { selectedIds });
  }

  async replaceCartItem(
    userId: number,
    { itemId, newVariantId, selectedIds }: ReplaceCartItemDto,
  ): Promise<CartInfo> {
    const cartItem = await this.cartItemRepository.findOneOrFail({
      where: { id: itemId, cart: { user: { id: userId } } },
      relations: {
        product: true,
      },
    });

    const newVariant = await this.productVariantRepository.findOneOrFail({
      where: { id: newVariantId },
    });

    await this.cartItemRepository.update(
      { id: cartItem.id },
      {
        product: newVariant,
        quantity: 1, // Reset quantity to 1 when replacing variant
      },
    );

    return await this.getCartInfoWithPrices(userId, { selectedIds });
  }

  async deleteCartItem(userId: number, { ids, selectedIds }: DeleteCartItemDto): Promise<CartInfo> {
    const cart = await this.cartRepository.findOneOrFail({
      where: { user: { id: userId } },
    });

    const cartItems = await this.cartItemRepository.findBy({
      id: In(ids),
      cartId: cart.id,
    });

    await this.cartItemRepository.remove(cartItems);

    return await this.getCartInfoWithPrices(userId, { selectedIds });
  }

  async countItem(userId: number): Promise<number> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: {
        cartItems: true,
      },
    });

    if (isEmpty(cart)) return 0; // Chưa có giỏ hàng, mặc định trả về 0

    return cart.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  async formatedCartItems(list: CartItem[]): Promise<CartProduct[]> {
    const cartItems: CartProduct[] = [];
    for (const item of list) {
      const variantList = await this.productVariantRepository.find({
        where: { productId: item.product.productId },
        relations: {
          variantValues: true,
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          variantValues: true,
          stock: true,
        },
      });
      cartItems.push({
        id: item.id,
        name: item.product.name,
        image: item.product.imageUrl,
        slug: item.product.product.slug,
        variantId: item.product.id,
        quantity: item.quantity,
        stock: item.product.stock,
        variants: variantList.map((variant) => {
          if (isEmpty(variant.variantValues)) return;

          return {
            id: variant.id,
            name: variant.name,
            image: variant.imageUrl,
            color: variant.variantValues[0].name,
            stock: variant.stock,
          };
        }),
        price: item.product.price,
        originalPrice: item.product.originalPrice,
      });
    }

    return cartItems;
  }

  async getCartInfoWithPrices(
    userId: number,
    { selectedIds }: ToggleCartItemDto,
  ): Promise<CartInfo> {
    const items = await this.cartItemRepository.find({
      where: { cart: { user: { id: userId } } },
      relations: {
        product: {
          product: true,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    const selectedItems = items.filter((i) => selectedIds.includes(i.id));
    const prices: CartPrices = selectedItems.reduce(
      (acc, currItem) => ({
        ...acc,
        total:
          acc.total +
          (currItem.product.originalPrice || currItem.product.price) * currItem.quantity,
        totalDiscount:
          acc.totalDiscount +
          ((currItem.product.originalPrice || currItem.product.price) - currItem.product.price) *
            currItem.quantity,
        totalVoucherPrice: 0,
        estimatedPrice: acc.estimatedPrice + currItem.product.price * currItem.quantity,
      }),
      { total: 0, totalDiscount: 0, totalVoucherPrice: 0, estimatedPrice: 0 } as CartPrices,
    );

    return new CartInfo({
      products: await this.formatedCartItems(items),
      prices,
    });
  }

  async getCartItems(userId: number, ids: string[]): Promise<CartItem[]> {
    return await this.cartItemRepository.find({
      where: { id: In(ids), cart: { user: { id: userId } } },
      relations: {
        product: {
          product: true,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    });
  }
}
