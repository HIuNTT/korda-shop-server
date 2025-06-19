import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductAttributeGroup } from './entities/product-attribute-group.entity';
import { In, Repository, TreeRepository } from 'typeorm';
import { ProductAttributeGroupDto } from './product-attribute-group.dto';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class ProductAttributeGroupService {
  constructor(
    @InjectRepository(ProductAttributeGroup)
    private readonly attributeGroupRepository: Repository<ProductAttributeGroup>,
    @InjectRepository(Category) private readonly categoryRepository: TreeRepository<Category>,
  ) {}

  async getAll() {
    return this.attributeGroupRepository.find();
  }

  async create({ categoryIds, ...data }: ProductAttributeGroupDto): Promise<void> {
    const attributeGroup = this.attributeGroupRepository.create({
      ...data,
      categories: await this.categoryRepository.findBy({ id: In(categoryIds) }),
    });
    await this.attributeGroupRepository.save(attributeGroup);
  }

  async update(id: number, { categoryIds, ...data }: ProductAttributeGroupDto): Promise<void> {
    const categories = await this.categoryRepository.findBy({ id: In(categoryIds) });
    const attributeGroup = await this.attributeGroupRepository.findOneByOrFail({ id });
    await this.attributeGroupRepository.save({ ...attributeGroup, ...data, categories });
  }

  async delete(id: number): Promise<void> {
    await this.attributeGroupRepository.delete(id);
  }

  async findOne(id: number): Promise<ProductAttributeGroup> {
    return this.attributeGroupRepository.findOneByOrFail({ id });
  }

  async getAttributeByCategory(categoryIds: number[]) {
    const attributeList = await this.attributeGroupRepository.find({
      where: {
        categories: {
          id: In(categoryIds),
        },
      },
      order: {
        orderNo: 'ASC',
      },
      relations: {
        attributes: {
          attributeOptions: true,
        },
      },
    });

    return attributeList;
  }
}
