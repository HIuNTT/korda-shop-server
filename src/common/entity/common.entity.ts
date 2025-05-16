import { Expose } from 'class-transformer';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Expose({ name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Expose({ name: 'deleted_at' })
  @DeleteDateColumn()
  deletedAt: Date;
}
