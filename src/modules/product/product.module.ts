import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { ProductImage } from './entities/product-image.entity';
import { UploadModule } from '../upload/upload.module';
import { ProductAttributeGroupModule } from '../product-attribute-group/product-attribute-group.module';
import { ProductGroup } from '../product-group/product-group.entity';
import { ProductVariant } from '../product-variant/entities/product-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductImage, ProductGroup, ProductVariant]),
    UploadModule,
    ProductAttributeGroupModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
