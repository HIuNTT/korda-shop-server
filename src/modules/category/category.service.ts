import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ILike, Not, TreeRepository } from 'typeorm';
import { CategoryDto, CategoryQueryDto } from './dto/category.dto';
import slugify from 'slugify';
import { deleteEmptyChildren } from '#/utils/list-tree.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: TreeRepository<Category>,
  ) {}

  async create({ parentId, ...data }: CategoryDto): Promise<void> {
    const parent = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :parentId', { parentId })
      .getOne();

    let slug = slugify(data.slug || data.name, { lower: true, strict: true, locale: 'vi' });
    const countExistedSlug = await this.categoryRepository.countBy({ slug });
    slug = countExistedSlug > 0 ? `${slug}-${countExistedSlug}` : slug;

    const category = this.categoryRepository.create({
      ...data,
      parent,
      slug,
    });

    await this.categoryRepository.save(category);
  }

  async update(id: number, { parentId, ...data }: CategoryDto): Promise<void> {
    const item = await this.categoryRepository.findOneByOrFail({ id });

    const parent = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :parentId', { parentId })
      .getOne();

    let slug = item.slug;
    if (data.slug !== slug || data.name !== item.name) {
      slug = slugify(data.slug || data.name, {
        lower: true,
        strict: true,
        locale: 'vi',
      });
      const countExistedSlug = await this.categoryRepository.countBy({ slug, id: Not(id) });
      slug = countExistedSlug > 0 ? `${slug}-${countExistedSlug}` : slug;
    }

    await this.categoryRepository.save({
      ...item,
      ...data,
      parent,
      slug,
    });
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  /** Đếm số lượng danh mục con của danh mục hiện tại */
  async countChildCat(id: number): Promise<number> {
    const parentCategory = await this.categoryRepository.findOneByOrFail({ id });
    return await this.categoryRepository.countDescendants(parentCategory);
  }

  async getCategoryTree({ name }: CategoryQueryDto): Promise<Category[]> {
    const tree: Category[] = [];

    if (name) {
      const categoryList = await this.categoryRepository.findBy({ name: ILike(`%${name}%`) });

      for (const category of categoryList) {
        const child = await this.categoryRepository.findDescendantsTree(category);
        tree.push(child);
      }

      deleteEmptyChildren(tree);

      return tree;
    }

    const roots = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.parent_id IS NULL')
      .orderBy('category.order_no', 'ASC')
      .getMany();

    for (const root of roots) {
      const child = await this.categoryRepository
        .createDescendantsQueryBuilder('category', 'categoryClosure', root)
        .orderBy('category.order_no', 'ASC')
        .getMany();
      root.children = child.filter((item) => item.parentId === root.id);
      tree.push(root);
    }

    deleteEmptyChildren(roots);

    return tree;
  }
}
