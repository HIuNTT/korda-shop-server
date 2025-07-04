import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductGroup } from './product-group.entity';
import { Repository } from 'typeorm';
import { ProductGroupDto } from './product-group.dto';

@Injectable()
export class ProductGroupService {
  constructor(
    @InjectRepository(ProductGroup) private productGroupRepository: Repository<ProductGroup>,
  ) {}

  async getAll() {
    return this.productGroupRepository.find();
  }

  async create(dto: ProductGroupDto): Promise<void> {
    await this.productGroupRepository.insert(dto);
  }

  async update(id: number, dto: ProductGroupDto): Promise<void> {
    await this.productGroupRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.productGroupRepository.delete(id);
  }
}
