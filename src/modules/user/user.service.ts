import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { ProviderType } from '#/constants/provider.constant';
import { isEmpty, isNil } from 'lodash';
import { Exists } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, isActived: true },
      relations: ['profile'],
    });
  }

  async findUserByPhone(phone: string): Promise<User | null> {
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
  }: UserDto): Promise<User | null> {
    return await this.entityManager.transaction(async (manager) => {
      if (password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);
      }
      const u = manager.create(User, {
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

      // return manager.findOne(User, {
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

  async getAccountInfo(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (isEmpty(user)) throw new BadRequestException('Không tìm thấy người dùng');

    return user;
  }
}
