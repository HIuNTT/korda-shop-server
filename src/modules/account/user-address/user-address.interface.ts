import { ApiProperty } from '@nestjs/swagger';
import { UserAddress } from './user-address.entity';
import { Expose } from 'class-transformer';

export class UserAddressRes extends UserAddress {
  @ApiProperty({ description: 'Địa chỉ đầy đủ' })
  @Expose({ name: 'full_address' })
  fullAddress: string;

  constructor(partial?: Partial<UserAddressRes>) {
    super();
    Object.assign(this, partial);
  }
}
