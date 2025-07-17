import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { QuoteController } from './controllers/quote.controller';
import { QuoteService } from './services/quote.service';
import { CartModule } from '../cart/cart.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from './entities/quote.entity';
import { QuoteItem } from './entities/quote-item.entity';
import { UserAddressModule } from '../account/user-address/user-address.module';
import { PaymentMethodModule } from '../payment/payment-method/payment-method.module';

@Module({
  imports: [
    CartModule,
    UserAddressModule,
    UserModule,
    PaymentMethodModule,
    TypeOrmModule.forFeature([Quote, QuoteItem]),
  ],
  controllers: [OrderController, QuoteController],
  providers: [OrderService, QuoteService],
})
export class OrderModule {}
