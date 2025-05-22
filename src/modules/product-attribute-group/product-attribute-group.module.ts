import { Module } from '@nestjs/common';
import { ProductAttributeGroupController } from './product-attribute-group.controller';
import { ProductAttributeGroupService } from './product-attribute-group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributeGroup } from './entities/product-attribute-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttributeGroup])],
  controllers: [ProductAttributeGroupController],
  providers: [ProductAttributeGroupService],
})
export class ProductAttributeGroupModule {}
