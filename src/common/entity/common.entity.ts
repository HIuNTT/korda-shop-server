import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'ID' })
  id: number;

  @Expose({ name: 'created_at' })
  @CreateDateColumn()
  @ApiProperty({ description: 'Ngày tạo', name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  @UpdateDateColumn()
  @ApiProperty({ description: 'Ngày cập nhật', name: 'updated_at' })
  updatedAt: Date;

  @Expose({ name: 'deleted_at' })
  @DeleteDateColumn()
  @ApiProperty({ description: 'Ngày xóa', name: 'deleted_at' })
  deletedAt: Date;
}

export abstract class CommonEntityUUID extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'ID' })
  id: string;

  @Expose({ name: 'created_at' })
  @CreateDateColumn()
  @ApiProperty({ description: 'Ngày tạo', name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  @UpdateDateColumn()
  @ApiProperty({ description: 'Ngày cập nhật', name: 'updated_at' })
  updatedAt: Date;

  @Expose({ name: 'deleted_at' })
  @DeleteDateColumn()
  @ApiProperty({ description: 'Ngày xóa', name: 'deleted_at' })
  deletedAt: Date;
}
