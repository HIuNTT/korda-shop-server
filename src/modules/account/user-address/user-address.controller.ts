import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { AuthUser } from '#/modules/auth/decorators/auth-user.decorator';
import { UserAddressDto } from './user-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserAddressRes } from './user-address.interface';
import { IdParam } from '#/common/decorators/id-param.decorator';

@ApiTags('Account - Địa chỉ người dùng')
@Controller('address')
export class UserAddressController {
  constructor(private userAddressService: UserAddressService) {}

  @Get()
  async getAll(@AuthUser() user: IAuthUser): Promise<UserAddressRes[]> {
    return await this.userAddressService.getAll(user.uid);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@AuthUser() user: IAuthUser, @Body() dto: UserAddressDto): Promise<void> {
    await this.userAddressService.create(user.uid, dto);
  }

  @Put(':id')
  async update(
    @AuthUser() user: IAuthUser,
    @IdParam() addressId: number,
    @Body() dto: UserAddressDto,
  ): Promise<void> {
    await this.userAddressService.update(user.uid, addressId, dto);
  }

  @Delete(':id')
  async delete(@AuthUser() user: IAuthUser, @IdParam() addressId: number): Promise<void> {
    await this.userAddressService.delete(user.uid, addressId);
  }
}
