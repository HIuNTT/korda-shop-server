import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CategoryModule } from './modules/category/category.module';
import { ProductAttributeGroupModule } from './modules/product-attribute-group/product-attribute-group.module';
import { ProductAttributeModule } from './modules/product-attribute/product-attribute.module';
import { ProductModule } from './modules/product/product.module';
import { UploadModule } from './modules/upload/upload.module';
import { ProductVariantModule } from './modules/product-variant/product-variant.module';
import { ProductGroupModule } from './modules/product-group/product-group.module';
import { CartModule } from './modules/cart/cart.module';
import { LocationModule } from './modules/location/location.module';
import { AccountModule } from './modules/account/account.module';
import { PaymentModule } from './modules/payment/payment.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    DatabaseModule,
    SharedModule,
    AuthModule,
    AccountModule,
    CategoryModule,
    ProductModule,
    ProductGroupModule,
    ProductAttributeGroupModule,
    ProductAttributeModule,
    ProductVariantModule,
    CartModule,
    OrderModule,
    LocationModule,
    PaymentModule,
    UploadModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },

    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) => new TimeoutInterceptor(15 * 1000, reflector),
      inject: [Reflector],
    },

    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
