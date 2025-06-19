import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetProductAttributesDto, ProductDto } from './dto/product.dto';
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

  /**
   *
   * Lấy danh sách thuộc tính sản phẩm theo danh mục
   * @remarks Danh sách ID danh mục được gửi lên phải là của các danh mục cấp cuối cùng
   */
  @Post('get-attributes')
  @HttpCode(HttpStatus.OK)
  async getAttributesByCategory(@Body() dto: GetProductAttributesDto) {
    return await this.productService.getAttributesByCategory(dto);
  }
}
