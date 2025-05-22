import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { IdParam } from '#/common/decorators/id-param.decorator';
import { Product } from './entities/product.entity';
import { ProductBySlug } from './interfaces/product.interface';

@ApiTags('Product - Sản phẩm')
@Public()
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  /**
   * Lấy thông tin một sản phẩm
   */
  @Get(':id')
  async getProductById(@IdParam() id: number): Promise<ProductBySlug> {
    return await this.productService.getProductById(id);
  }

  /**
   * Tạo một sản phẩm mới
   * @remarks Hành động này cho phép tạo một sản phẩm mới.
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: ProductDto): Promise<void> {
    await this.productService.create(dto);
  }

  /**
   * Cập nhật thông tin sản phẩm
   */
  @Put(':id')
  async update(@IdParam() id: number, @Body() dto: ProductDto): Promise<void> {
    await this.productService.update(id, dto);
  }

  /**
   * Xóa một sản phẩm
   */
  @Delete(':id')
  async delete(@IdParam() id: number): Promise<void> {
    await this.productService.delete(id);
  }
}
