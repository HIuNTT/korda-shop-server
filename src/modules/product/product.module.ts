import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { ProductImage } from './entities/product-image.entity';
import { UploadModule } from '../upload/upload.module';
import { ProductAttributeGroupModule } from '../product-attribute-group/product-attribute-group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductImage]),
    UploadModule,
    ProductAttributeGroupModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
