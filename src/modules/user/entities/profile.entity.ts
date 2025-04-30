import { CommonEntity } from '#/common/entity/common.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import type { UserEntity } from './user.entity';

@Entity({ name: 'profiles' })
export class ProfileEntity extends CommonEntity {
  @Column()
  fullName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: 0 })
  gender: number;

  @Column({ nullable: true })
  birthday: Date;

  @OneToOne('UserEntity', {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;
}
