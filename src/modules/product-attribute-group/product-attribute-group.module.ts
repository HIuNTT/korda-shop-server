import { Module } from '@nestjs/common';
import { ProductAttributeGroupController } from './product-attribute-group.controller';
import { ProductAttributeGroupService } from './product-attribute-group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributeGroup } from './entities/product-attribute-group.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttributeGroup, Category])],
  controllers: [ProductAttributeGroupController],
  providers: [ProductAttributeGroupService],
  exports: [ProductAttributeGroupService],
})
export class ProductAttributeGroupModule {}
