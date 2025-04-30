import { CommonEntity } from '#/common/entity/common.entity';
import { Column, Entity, OneToMany, OneToOne, Relation } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { RoleType } from '#/constants/role.constant';
import { ProviderType } from '#/constants/provider.constant';
import { RefreshTokenEntity } from '#/modules/auth/entities/refresh-token.entity';

@Entity({ name: 'users' })
export class UserEntity extends CommonEntity {
  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'enum', enum: ProviderType, nullable: true })
  provider: ProviderType;

  @Column({ type: 'boolean', default: false })
  isActived: boolean;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: Relation<RefreshTokenEntity[]>;

  @OneToOne('ProfileEntity', (profile: ProfileEntity) => profile.user, {
    cascade: true,
  })
  profile: ProfileEntity;
}
