import { Module } from '@nestjs/common';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { RouterModule } from '@nestjs/core';

const modules = [PaymentMethodModule];

@Module({
  imports: [
    ...modules,
    RouterModule.register([
      {
        path: 'payment',
        module: PaymentModule,
        children: [...modules],
      },
    ]),
  ],
  exports: [...modules],
})
export class PaymentModule {}
