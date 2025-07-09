import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { UserAddress } from './user-address.entity';
import { EntityManager, Not, Repository } from 'typeorm';
import { UserAddressDto } from './user-address.dto';
import { isEmpty } from 'lodash';
import { User } from '#/modules/user/entities/user.entity';
import { UserAddressRes } from './user-address.interface';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress) private userAddressRepository: Repository<UserAddress>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async getAll(userId: number): Promise<UserAddressRes[]> {
    const addressList = await this.userAddressRepository.find({
      where: { user: { id: userId } },
      order: { isDefault: 'DESC', updatedAt: 'DESC' },
      relations: {
        province: true,
        district: true,
        ward: true,
      },
    });

    return addressList.map((address) => {
      const { province, district, ward, ...rest } = address;
      return new UserAddressRes({
        ...rest,
        fullAddress: [rest.address, ward.name, district.name, province.name].join(', '),
      });
    });
  }

  async create(userId: number, dto: UserAddressDto): Promise<void> {
    const defaultAddress = await this.userAddressRepository.findOneBy({
      user: { id: userId },
      isDefault: true,
    });

    await this.entityManager.transaction(async (manager) => {
      if (dto.isDefault && !isEmpty(defaultAddress)) {
        // Nếu địa chỉ mới là mặc định, cập nhật địa chỉ cũ thành không mặc định
        defaultAddress.isDefault = false;
        await manager.save(defaultAddress);
      }

      const newAddress = manager.create(UserAddress, {
        ...dto,
        user: await manager.findOneBy(User, { id: userId }),
      });

      await manager.save(newAddress);
    });
  }

  async update(userId: number, addressId: number, dto: UserAddressDto): Promise<void> {
    const defaultAddress = await this.userAddressRepository.findOneBy({
      user: { id: userId },
      id: Not(addressId),
      isDefault: true,
    });

    const address = await this.userAddressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    await this.entityManager.transaction(async (manager) => {
      if (dto.isDefault && !isEmpty(defaultAddress)) {
        // Nếu địa chỉ mới là mặc định, cập nhật địa chỉ cũ thành không mặc định
        defaultAddress.isDefault = false;
        await manager.save(defaultAddress);
      }

      const updateAddress = manager.create(UserAddress, {
        ...address,
        ...dto,
      });

      await manager.save(updateAddress);
    });
  }

  async delete(userId: number, addressId: number): Promise<void> {
    const address = await this.userAddressRepository.findOneOrFail({
      where: { id: addressId, user: { id: userId } },
    });

    if (address.isDefault) {
      throw new BadRequestException('Không thể xóa địa chỉ mặc định');
    }

    await this.userAddressRepository.remove(address);
  }
}
