import type { User } from '#/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  value!: string;

  @Column({ type: 'timestamptz' })
  expiredAt!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne('User', (user: User) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;
}
