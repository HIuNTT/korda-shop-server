import { Module } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantController } from './product-variant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantType } from './entities/product-variant-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariantType])],
  providers: [ProductVariantService],
  controllers: [ProductVariantController],
})
export class ProductVariantModule {}
