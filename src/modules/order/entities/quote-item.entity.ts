import { ProductVariant } from '#/modules/product-variant/entities/product-variant.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { Quote } from './quote.entity';

@Entity()
export class QuoteItem {
  @Expose({ name: 'product_id' })
  @PrimaryColumn()
  productId: number;

  @Expose({ name: 'quote_id' })
  @PrimaryColumn()
  quoteId: string;

  @Column()
  quantity: number;

  @ManyToOne(() => ProductVariant)
  product: ProductVariant;

  @ManyToOne(() => Quote, { onDelete: 'CASCADE' })
  quote: Relation<Quote>;
}
