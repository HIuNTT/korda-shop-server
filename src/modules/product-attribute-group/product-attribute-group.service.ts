import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductAttributeGroup } from './entities/product-attribute-group.entity';
import { Repository } from 'typeorm';
import { ProductAttributeGroupDto } from './product-attribute-group.dto';

@Injectable()
export class ProductAttributeGroupService {
  constructor(
    @InjectRepository(ProductAttributeGroup)
    private readonly attributeGroupRepository: Repository<ProductAttributeGroup>,
  ) {}

  async getAll() {
    return this.attributeGroupRepository.find();
  }

  async create(dto: ProductAttributeGroupDto): Promise<void> {
    await this.attributeGroupRepository.insert(dto);
  }

  async update(id: number, dto: ProductAttributeGroupDto): Promise<void> {
    await this.attributeGroupRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.attributeGroupRepository.delete(id);
  }

  async findOne(id: number): Promise<ProductAttributeGroup> {
    return this.attributeGroupRepository.findOneByOrFail({ id });
  }
}
