import { CommonEntity } from '#/common/entity/common.entity';
import { Category } from '#/modules/category/entities/category.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Product extends CommonEntity {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Expose({ name: 'thumbnail_url' })
  @Column()
  thumbnailUrl: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  stock: number;

  @Column()
  price: number;

  @Expose({ name: 'original_price' })
  @Column({ default: 0 })
  originalPrice: number;

  @Expose({ name: 'rating_sum' })
  @Column({ default: 0 })
  ratingSum: number;

  @Expose({ name: 'review_count' })
  @Column({ default: 0 })
  reviewCount: number;

  @Expose({ name: 'is_actived' })
  @Column({ default: true })
  isActived: boolean;

  @ManyToOne(() => Category, {
    onDelete: 'SET NULL',
    cascade: true,
  })
  category: Category;
}
