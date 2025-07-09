import { Module } from '@nestjs/common';
import { UserAddressController } from './user-address.controller';
import { UserAddressService } from './user-address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from './user-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress])],
  controllers: [UserAddressController],
  providers: [UserAddressService],
})
export class UserAddressModule {}
