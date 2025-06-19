import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service';
import { ProductAttributeDto } from './product-attribute.dto';
import { IdParam } from '#/common/decorators/id-param.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@Public()
@ApiTags('Attribute - Thuộc tính sản phẩm')
@Controller('product-attribute')
export class ProductAttributeController {
  constructor(private readonly productAttributeService: ProductAttributeService) {}

  @Get(':id')
  async info(@IdParam() id: number) {
    return this.productAttributeService.findOne(id);
  }

  /**
   * Tạo mới một thuộc tính sản phẩm
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: ProductAttributeDto): Promise<void> {
    await this.productAttributeService.create(dto);
  }

  /**
   * Cập nhật một thuộc tính sản phẩm
   */
  @Put(':id')
  async update(@IdParam() id: number, @Body() dto: ProductAttributeDto): Promise<void> {
    await this.productAttributeService.update(id, dto);
  }

  /**
   * Xóa một thuộc tính sản phẩm
   */
  @Delete(':id')
  async delete(@IdParam() id: number): Promise<void> {
    await this.productAttributeService.delete(id);
  }
}
