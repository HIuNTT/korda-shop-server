import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductAttribute } from './entites/product-attribute.entity';
import { Repository } from 'typeorm';
import { ProductAttributeDto } from './product-attribute.dto';
import { ProductAttributeGroupService } from '../product-attribute-group/product-attribute-group.service';
import { InputType } from '#/constants/input-type.constant';

@Injectable()
export class ProductAttributeService {
  constructor(
    @InjectRepository(ProductAttribute)
    private readonly attributeRepository: Repository<ProductAttribute>,
    private readonly productAttributeGroupService: ProductAttributeGroupService,
  ) {}

  async create(dto: ProductAttributeDto): Promise<void> {
    const { groupId, inputType, options, ...rest } = dto;
    const group = await this.productAttributeGroupService.findOne(groupId);

    const orderedOptions = options?.map((option, index) => ({
      ...option,
      orderNo: index + 1,
    }));

    const attribute = this.attributeRepository.create({
      ...rest,
      group,
      inputType,
      ...((inputType === InputType.DROPDOWN || inputType === InputType.MULTIPLE_SELECTION) && {
        attributeOptions: orderedOptions,
      }),
    });
    await this.attributeRepository.save(attribute);
  }

  async update(id: number, dto: ProductAttributeDto): Promise<void> {
    const existAttribute = await this.attributeRepository.findOneByOrFail({ id });

    const { groupId, inputType, options, ...rest } = dto;

    const orderedOptions = options?.map((option, index) => ({
      ...option,
      orderNo: index + 1,
    }));

    await this.attributeRepository.save({
      ...existAttribute,
      ...rest,
      group: await this.productAttributeGroupService.findOne(groupId),
      inputType,
      ...((inputType === InputType.DROPDOWN || inputType === InputType.MULTIPLE_SELECTION) && {
        attributeOptions: orderedOptions,
      }),
    });
  }

  async delete(id: number): Promise<void> {
    await this.attributeRepository.delete(id);
  }

  async findOne(id: number): Promise<ProductAttribute> {
    return this.attributeRepository.findOneByOrFail({ id });
  }
}
