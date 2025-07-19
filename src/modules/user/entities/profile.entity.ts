import { CommonEntity } from '#/common/entity/common.entity';
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import { User } from './user.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Profile extends CommonEntity {
  @Expose({ name: 'full_name' })
  @Column()
  fullName: string;

  @Expose({ name: 'avatar_url' })
  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ default: 0, comment: '1: male; 2: female; 3: other' })
  gender: number;

  @Column({ nullable: true })
  birthday?: Date;

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Relation<User>;
}
