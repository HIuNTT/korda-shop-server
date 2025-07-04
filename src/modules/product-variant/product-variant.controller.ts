import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantTypeDto } from './dto/product-variant.dto';
import { IdParam } from '#/common/decorators/id-param.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { ProductVariantType } from './entities/product-variant-type.entity';

@Public()
@ApiTags('Variant - Biến thể sản phẩm')
@Controller('product-variant')
export class ProductVariantController {
  constructor(private productVariantService: ProductVariantService) {}

  @Get('variant-type/all')
  async getAllVariantTypes(): Promise<ProductVariantType[]> {
    return this.productVariantService.getAllVariantTypes();
  }

  @Post('variant-type')
  @HttpCode(HttpStatus.OK)
  async createVariantType(@Body() dto: ProductVariantTypeDto): Promise<void> {
    await this.productVariantService.createVariantType(dto);
  }

  @Put('variant-type/:id')
  async updateVariantType(
    @IdParam() id: number,
    @Body() dto: ProductVariantTypeDto,
  ): Promise<void> {
    await this.productVariantService.updateVariantType(id, dto);
  }

  @Delete('variant-type/:id')
  async deleteVariantType(@IdParam() id: number): Promise<void> {
    await this.productVariantService.deleteVariantType(id);
  }
}
