import { BadRequestException, Injectable } from '@nestjs/common';
import { QuoteDto } from '../dto/quote.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CartService } from '#/modules/cart/cart.service';
import { Quote } from '../entities/quote.entity';
import { UserService } from '#/modules/user/user.service';
import { QuoteItem } from '../entities/quote-item.entity';
import { QuoteInfo, QuotePrices, QuoteProduct } from '../interfaces/quote.interface';

@Injectable()
export class QuoteService {
  constructor(
    @InjectRepository(Quote) private quoteRepository: Repository<Quote>,
    @InjectRepository(QuoteItem) private quoteItemRepository: Repository<QuoteItem>,
    private cartService: CartService,
    private userService: UserService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  /** Tạo một bản nháp order */
  async createQuote(userId: number, { selectedIds }: QuoteDto): Promise<void> {
    const cartItems = await this.cartService.getCartItems(userId, selectedIds);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newQuote = queryRunner.manager.create(Quote, {
        user: await this.userService.findUserById(userId),
      });

      const quote = await queryRunner.manager.save(newQuote);

      const quoteItems = cartItems.map((item) =>
        queryRunner.manager.create(QuoteItem, {
          quote,
          product: item.product,
          quantity: item.quantity,
        }),
      );
      await queryRunner.manager.save(quoteItems);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Failed to create quote');
    } finally {
      await queryRunner.release();
    }
  }

  async delete(userId: number, quoteId: string): Promise<void> {
    await this.quoteRepository.delete({ id: quoteId, user: { id: userId } });
  }

  async info(userId: number): Promise<QuoteInfo> {
    const quote = await this.quoteRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    const quoteItems = await this.quoteItemRepository.find({
      where: { quote: { id: quote.id } },
      relations: {
        product: {
          product: true,
        },
      },
    });

    const prices: QuotePrices = {
      total: 0,
      totalDiscount: 0,
      totalVoucherPrice: 0,
      estimatedPrice: 0,
      estimatedShippingPrice: 0,
    };

    const quoteItemResult: QuoteProduct[] = [];

    for (const quoteItem of quoteItems) {
      quoteItemResult.push({
        id: quoteItem.productId,
        name: quoteItem.product.name,
        image: quoteItem.product.imageUrl || quoteItem.product.product.thumbnailUrl,
        quantity: quoteItem.quantity,
        price: quoteItem.product.price,
        originalPrice: quoteItem.product.originalPrice,
      });

      prices.total +=
        (quoteItem.product.originalPrice || quoteItem.product.price) * quoteItem.quantity;
      prices.totalDiscount +=
        ((quoteItem.product.originalPrice || quoteItem.product.price) - quoteItem.product.price) *
        quoteItem.quantity;
      prices.estimatedPrice +=
        quoteItem.product.price * quoteItem.quantity + prices.estimatedShippingPrice;
    }

    return new QuoteInfo({
      ...quote,
      products: quoteItemResult,
      prices,
    });
  }

  async findQuoteById(userId: number, quoteId: string): Promise<Quote> {
    return this.quoteRepository.findOneOrFail({
      where: { id: quoteId, user: { id: userId } },
    });
  }

  async findQuoteItemByQuoteId(quoteId: string): Promise<QuoteItem[]> {
    return this.quoteItemRepository.find({
      where: { quote: { id: quoteId } },
      relations: {
        product: {
          product: true,
        },
      },
    });
  }
}
