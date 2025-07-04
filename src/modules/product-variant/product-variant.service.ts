import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariantTypeDto } from './dto/product-variant.dto';
import { ProductVariantType } from './entities/product-variant-type.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariantType)
    private variantTypeRepository: Repository<ProductVariantType>,
  ) {}

  async getAllVariantTypes(): Promise<ProductVariantType[]> {
    return this.variantTypeRepository.find({
      select: {
        id: true,
        name: true,
        variantOptions: {
          id: true,
          name: true,
        },
      },
      relations: {
        variantOptions: true,
      },
    });
  }

  async createVariantType({ name, options }: ProductVariantTypeDto): Promise<void> {
    const variantOptions = options.map((option, idx) => ({
      name: option.name,
      orderNo: idx + 1,
    }));

    const variantType = this.variantTypeRepository.create({
      name,
      variantOptions,
    });

    await this.variantTypeRepository.save(variantType);
  }

  async updateVariantType(id: number, dto: ProductVariantTypeDto): Promise<void> {
    const variantType = await this.variantTypeRepository.findOneByOrFail({ id });

    const variantOptions = dto.options.map((option, idx) => ({
      name: option.name,
      orderNo: idx + 1,
    }));

    await this.variantTypeRepository.save({
      ...variantType,
      name: dto.name,
      variantOptions,
    });
  }

  async deleteVariantType(id: number): Promise<void> {
    await this.variantTypeRepository.delete({ id });
  }
}
