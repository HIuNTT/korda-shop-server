import type { UserEntity } from '#/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user_refresh_tokens' })
export class RefreshTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  value!: string;

  @Column()
  expiredAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne('UserEntity', (user: UserEntity) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: UserEntity;
}
