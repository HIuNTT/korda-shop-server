import { CommonEntity } from '#/common/entity/common.entity';
import { UserAddressType } from '#/modules/account/user-address/user-address.entity';
import { District } from '#/modules/location/entities/district.entity';
import { Province } from '#/modules/location/entities/province.entity';
import { Ward } from '#/modules/location/entities/ward.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Relation } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class ShippingAddress extends CommonEntity {
  @ApiProperty({ description: 'Họ và tên người nhận' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Số điện thoại người nhận' })
  @Column()
  phone: string;

  @ApiProperty({ description: 'Địa chỉ cụ thể của người nhận' })
  @Column()
  address: string;

  @Column({ default: UserAddressType.HOME, comment: 'Loại địa chỉ: 1 - Nhà, 2 - Văn phòng' })
  type: number;

  @ApiProperty({ description: 'ID của tỉnh/thành phố' })
  @Expose({ name: 'province_id' })
  @Column()
  provinceId: number;

  @ApiProperty({ description: 'ID của quận/huyện' })
  @Expose({ name: 'district_id' })
  @Column()
  districtId: number;

  @ApiProperty({ description: 'ID của phường/xã' })
  @Expose({ name: 'ward_id' })
  @Column()
  wardId: number;

  @ManyToOne(() => Province, {
    onDelete: 'SET NULL',
  })
  province: Province;

  @ManyToOne(() => District, {
    onDelete: 'SET NULL',
  })
  district: District;

  @ManyToOne(() => Ward, {
    onDelete: 'SET NULL',
  })
  ward: Ward;

  @OneToOne(() => Order, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order: Relation<Order>;
}
