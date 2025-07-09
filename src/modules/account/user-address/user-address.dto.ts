import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { UserAddressType } from './user-address.entity';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserAddressDto {
  @ApiProperty({ description: 'Họ và tên người nhận' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Số điện thoại người nhận' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @ApiProperty({ description: 'Địa chỉ cụ thể của người nhận' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Loại địa chỉ',
    enum: UserAddressType,
    default: UserAddressType.HOME,
  })
  @IsEnum(UserAddressType)
  type: UserAddressType;

  @ApiProperty({ name: 'province_id', description: 'ID của tỉnh/thành phố' })
  @Expose({ name: 'province_id' })
  @IsInt()
  provinceId: number;

  @ApiProperty({ name: 'district_id', description: 'ID của quận/huyện' })
  @Expose({ name: 'district_id' })
  @IsInt()
  districtId: number;

  @ApiProperty({ name: 'ward_id', description: 'ID của phường/xã' })
  @Expose({ name: 'ward_id' })
  @IsInt()
  wardId: number;

  @ApiProperty({ name: 'is_default', description: 'Là địa chỉ mặc định?', default: false })
  @Expose({ name: 'is_default' })
  @IsBoolean()
  isDefault: boolean;
}
