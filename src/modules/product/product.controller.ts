import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { GetProductAttributesDto, GetProductDetailDto, ProductDto } from './dto/product.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { IdParam } from '#/common/decorators/id-param.decorator';
import { ProductBySlug } from './interfaces/product.interface';
import { GetProductDetail } from './interfaces/product-detail.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '#/constants/role.constant';

@ApiTags('Product - Sản phẩm')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  /**
   * Lấy chi tiết sản phẩm (admin side)
   */
  @Get('detail')
  @Roles(RoleType.ADMIN)
  async getProductDetailBySlug(@Query() dto: GetProductDetailDto): Promise<GetProductDetail> {
    return await this.productService.getProductDetailBySlug(dto.slug);
  }

  /**
   * Lấy thông tin một sản phẩm bằng slug
   */
  @Get(':slug')
  @Public()
  async getProductBySlug(@Param('slug') slug: string): Promise<ProductBySlug> {
    return await this.productService.getProductBySlug(slug);
  }

  /**
   * Tạo một sản phẩm mới
   * @remarks Hành động này cho phép tạo một sản phẩm mới.
   */
  @Post()
  @Roles(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: ProductDto): Promise<void> {
    await this.productService.create(dto);
  }

  /**
   * Cập nhật thông tin sản phẩm
   */
  @Put(':id')
  @Roles(RoleType.ADMIN)
  async update(@IdParam() id: number, @Body() dto: ProductDto): Promise<void> {
    await this.productService.update(id, dto);
  }

  /**
   * Xóa một sản phẩm
   */
  @Delete(':id')
  @Roles(RoleType.ADMIN)
  async delete(@IdParam() id: number): Promise<void> {
    await this.productService.delete(id);
  }

  /**
   *
   * Lấy danh sách thuộc tính sản phẩm theo danh mục
   * @remarks Danh sách ID danh mục được gửi lên phải là của các danh mục cấp cuối cùng
   */
  @Post('get-attributes')
  @Roles(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAttributesByCategory(@Body() dto: GetProductAttributesDto) {
    return await this.productService.getAttributesByCategory(dto);
  }
}
