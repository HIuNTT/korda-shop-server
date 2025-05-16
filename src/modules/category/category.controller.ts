import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto, CategoryQueryDto } from './dto/category.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '#/constants/role.constant';
import { IdParam } from '#/common/decorators/id-param.decorator';
import { Category } from './entities/category.entity';
import { Public } from '../auth/decorators/public.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  async list(@Query() dto: CategoryQueryDto): Promise<Category[]> {
    return this.categoryService.getCategoryTree(dto);
  }

  @Roles(RoleType.ADMIN)
  @Post()
  async create(@Body() dto: CategoryDto): Promise<void> {
    await this.categoryService.create(dto);
  }

  @Put(':id')
  @Roles(RoleType.ADMIN)
  async update(@IdParam() id: number, @Body() updateCategoryDto: CategoryDto): Promise<void> {
    await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN)
  async delete(@IdParam() id: number): Promise<void> {
    const count = await this.categoryService.countChildCat(id);
    console.log('count', count);

    if (count > 0) {
      throw new BadRequestException(
        'Danh mục này có danh mục con, vui lòng xóa danh mục con trước',
      );
    }

    await this.categoryService.delete(id);
  }
}
