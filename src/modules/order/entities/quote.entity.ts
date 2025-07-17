import { CommonEntityUUID } from '#/common/entity/common.entity';
import { User } from '#/modules/user/entities/user.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { QuoteItem } from './quote-item.entity';

@Entity()
export class Quote extends CommonEntityUUID {
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => QuoteItem, (item) => item.quote)
  items: QuoteItem[];
}
