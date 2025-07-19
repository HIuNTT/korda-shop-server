import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { ProductGroupService } from './product-group.service';
import { ProductGroup } from './product-group.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductGroupDto } from './product-group.dto';
import { IdParam } from '#/common/decorators/id-param.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Public()
@ApiTags('Product Group - Nhóm sản phẩm')
@Controller('product-group')
export class ProductGroupController {
  constructor(private productGroupService: ProductGroupService) {}

  @Get('all')
  @ApiOperation({ summary: 'Lấy tất cả nhóm sản phẩm cùng một lúc (không phân trang)' })
  async getAll(): Promise<ProductGroup[]> {
    return this.productGroupService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo nhóm sản phẩm mới' })
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: ProductGroupDto): Promise<void> {
    await this.productGroupService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật nhóm sản phẩm' })
  async update(@IdParam() id: number, @Body() dto: ProductGroupDto): Promise<void> {
    await this.productGroupService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá nhóm sản phẩm được chỉ định' })
  async delete(@IdParam() id: number): Promise<void> {
    await this.productGroupService.delete(id);
  }
}
