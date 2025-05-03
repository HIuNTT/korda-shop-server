import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { ProviderType } from '#/constants/provider.constant';
import { isNil } from 'lodash';
import { Exists } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email, isActived: true },
      relations: ['profile'],
    });
  }

  async findUserByPhone(phone: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { phone, isActived: true },
      relations: ['profile'],
    });
  }

  async createUser({
    fullName,
    avatarUrl,
    email,
    password,
    phone,
    provider,
    isActived,
  }: UserDto): Promise<UserEntity | null> {
    return await this.entityManager.transaction(async (manager) => {
      if (password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);
      }
      const u = manager.create(UserEntity, {
        email,
        password,
        phone,
        provider: provider as ProviderType,
        isActived,
        profile: {
          fullName,
          avatarUrl,
        },
      });

      return await manager.save(u);
      // console.log('User created 2:', user);

      // return manager.findOne(UserEntity, {
      //   select: {
      //     password: false,
      //   },
      //   where: { id: user.id },
      //   relations: ['profile'],
      // });
    });
  }

  async checkEmailExists(email: string): Promise<Exists> {
    const exists = await this.userRepository.findOneBy({ email });

    return {
      existed: !isNil(exists),
    };
  }
}
