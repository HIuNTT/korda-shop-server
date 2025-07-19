import { CommonEntity } from '#/common/entity/common.entity';
import { Column, Entity, OneToMany, OneToOne, Relation } from 'typeorm';
import { Profile } from './profile.entity';
import { RoleType } from '#/constants/role.constant';
import { ProviderType } from '#/constants/provider.constant';
import { RefreshToken } from '#/modules/auth/entities/refresh-token.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class User extends CommonEntity {
  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'enum', enum: ProviderType, nullable: true })
  provider?: ProviderType;

  @Expose({ name: 'is_actived' })
  @Column({ type: 'boolean', default: false })
  isActived: boolean;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: Relation<RefreshToken[]>;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile: Relation<Profile>;
}
