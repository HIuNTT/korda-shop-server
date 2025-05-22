import { CommonEntity } from '#/common/entity/common.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity()
@Tree('materialized-path')
export class Category extends CommonEntity {
  @Column()
  name: string;

  @Expose({ name: 'order_no' })
  @Column({ nullable: true, default: 0 })
  orderNo: number;

  @Column({ unique: true })
  slug: string;

  @Expose({ name: 'image_url' })
  @Column({ nullable: true })
  imageUrl?: string;

  mpath?: string;

  @TreeChildren({ cascade: true })
  children: Category[];

  @Expose({ name: 'parent_id' })
  @Column({ nullable: true })
  parentId: number;

  @TreeParent({ onDelete: 'SET NULL' })
  parent?: Category;
}
