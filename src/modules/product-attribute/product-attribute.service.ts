import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductAttribute } from './entites/product-attribute.entity';
import { Repository } from 'typeorm';
import { ProductAttributeDto } from './product-attribute.dto';

@Injectable()
export class ProductAttributeService {
  constructor(
    @InjectRepository(ProductAttribute)
    private readonly attributeRepository: Repository<ProductAttribute>,
  ) {}

  async create(dto: ProductAttributeDto): Promise<void> {
    const { groupId, ...rest } = dto;
    await this.attributeRepository.insert({
      ...rest,
      group: {
        id: groupId,
      },
    });
  }

  async update(id: number, dto: ProductAttributeDto): Promise<void> {
    const { groupId, ...rest } = dto;
    await this.attributeRepository.update(id, {
      ...rest,
      group: {
        id: groupId,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.attributeRepository.delete(id);
  }

  async findOne(id: number): Promise<ProductAttribute> {
    return this.attributeRepository.findOneByOrFail({ id });
  }
}
