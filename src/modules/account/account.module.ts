import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UserAddressModule } from './user-address/user-address.module';

const modules = [UserAddressModule];

@Module({
  imports: [
    ...modules,
    RouterModule.register([
      {
        path: 'account',
        module: AccountModule,
        children: [...modules],
      },
    ]),
  ],
  exports: [...modules],
})
export class AccountModule {}
