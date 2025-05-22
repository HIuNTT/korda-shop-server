import { Module } from '@nestjs/common';
import { ProductAttributeController } from './product-attribute.controller';
import { ProductAttributeService } from './product-attribute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttribute } from './entites/product-attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttribute])],
  controllers: [ProductAttributeController],
  providers: [ProductAttributeService],
})
export class ProductAttributeModule {}
