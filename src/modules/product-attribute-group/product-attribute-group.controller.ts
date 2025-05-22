import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ProductAttributeGroupService } from './product-attribute-group.service';
import { ProductAttributeGroup } from './entities/product-attribute-group.entity';
import { Public } from '../auth/decorators/public.decorator';
import { ProductAttributeGroupDto } from './product-attribute-group.dto';
import { IdParam } from '#/common/decorators/id-param.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Attribute Group - Nhóm thuộc tính sản phẩm')
@Public()
@Controller('product-attribute-group')
export class ProductAttributeGroupController {
  constructor(private readonly attributeGroupService: ProductAttributeGroupService) {}

  @Get('all')
  async getAll(): Promise<ProductAttributeGroup[]> {
    return this.attributeGroupService.getAll();
  }

  /** Tạo nhóm thuộc tính
   * @remarks Hành động này cho phép tạo một nhóm thuộc tính mới.
   */
  @Post()
  async create(@Body() dto: ProductAttributeGroupDto): Promise<void> {
    await this.attributeGroupService.create(dto);
  }

  /** Cập nhật nhóm thuộc tính
   * @remarks Hành động này cho phép cập nhật một nhóm thuộc tính mới.
   */
  @Put(':id')
  async update(@IdParam() id: number, @Body() dto: ProductAttributeGroupDto): Promise<void> {
    await this.attributeGroupService.update(id, dto);
  }

  /** Xóa nhóm thuộc tính
   * @remarks Hành động này cho phép xóa một nhóm thuộc tính mới.
   */
  @Delete(':id')
  async delete(@IdParam() id: number): Promise<void> {
    await this.attributeGroupService.delete(id);
  }
}
