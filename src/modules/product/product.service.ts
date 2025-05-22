import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EntityManager, In, Repository, TreeRepository } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { Category } from '../category/entities/category.entity';
import slugify from 'slugify';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';
import { ProductAttribute } from '../product-attribute/entites/product-attribute.entity';
import { ProductImage } from './entities/product-image.entity';
import { AttributeGroupHasMap, DefaultAttribute } from './interfaces/attribute.interface';
import { Breadcrumb, ProductBySlug } from './interfaces/product.interface';
import { deleteFields } from '#/utils/tool.util';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category) private categoryRepository: TreeRepository<Category>,
    @InjectRepository(ProductImage) private productImageRepository: Repository<ProductImage>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {
    categoryRepository.metadata.columns = categoryRepository.metadata.columns.map((cat) => {
      if (cat.databaseName === 'mpath') {
        cat.isVirtual = false;
      }
      return cat;
    });
  }

  async getProductById(id: number): Promise<ProductBySlug> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        categories: true,
        images: true,
        attributes: {
          attribute: {
            group: true,
          },
        },
      },
    });

    // Tìm danh mục có độ sâu lớn nhất
    const deepestCategory = product.categories?.reduce((acc, cur) => {
      return acc.mpath.length > cur.mpath.length ? acc : cur;
    });

    // Sinh breadcrumbs từ danh mục có độ sâu lớn nhất
    const ancestor = await this.categoryRepository.findAncestors(deepestCategory);
    const breadcrumbs = ancestor.reduce((acc: Breadcrumb[], cur) => {
      if (acc.length === 0) {
        return [...acc, { path: '/' + cur.slug, name: cur.name }];
      } else {
        return [...acc, { path: acc.at(-1).path + '/' + cur.slug, name: cur.name }];
      }
    }, []);

    if (!product) {
      throw new NotFoundException(`Sản phẩm không tồn tại`);
    }

    // Tính toán điểm đánh giá trung bình
    const aggregateRating =
      product.reviewCount > 0 ? Math.round((product.ratingSum / product.reviewCount) * 10) / 10 : 0;

    // Tính phẩn trăm giảm giá
    const discountPercent =
      product.originalPrice > 0
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const listImages = await this.productImageRepository.find({
      select: {
        url: true,
        orderNo: true,
      },
      where: { product: { id } },
      order: { orderNo: 'ASC' },
    });

    const defaultAttributes: DefaultAttribute[] = [];
    const attributesMap = new Map<number, AttributeGroupHasMap>();

    // Format lại danh sách thuộc tính được bọc bởi tình nhóm thuộc tính
    product.attributes.forEach((attribute) => {
      const group = attribute.attribute.group;
      const attributeId = attribute.attributeId;
      const attributeValue = attribute.value;
      const attributeName = attribute.attribute.name;
      const attributeOrderNo = attribute.attribute.orderNo;

      const isDefaultAttribute = attribute.attribute.isSelected;
      if (isDefaultAttribute) {
        defaultAttributes.push({
          name: attributeName,
          value: attributeValue,
          orderNo: attributeOrderNo,
        });
      }

      if (!attributesMap.has(group.id)) {
        attributesMap.set(group.id, {
          groupName: group.name,
          orderNo: group.orderNo,
          attributes: [],
        });
      }

      attributesMap.get(group.id).attributes.push({
        id: attributeId,
        name: attributeName,
        orderNo: attributeOrderNo,
        value: attributeValue,
      });
    });

    // Sắp xếp danh sách thuộc tính theo thứ tự hiển thị
    const resultAttributes = Array.from(attributesMap.values())
      .map((item) => {
        item.attributes.sort((a, b) => a.orderNo - b.orderNo);
        return item;
      })
      .sort((a, b) => a.orderNo - b.orderNo);

    deleteFields(product, ['ratingSum', 'attributes']);

    return new ProductBySlug({
      ...product,
      discountPercent,
      aggregateRating,
      images: listImages,
      defaultAttributes: defaultAttributes.sort((a, b) => a.orderNo - b.orderNo),
      attributeItems: resultAttributes,
      breadcrumbs,
    });
  }

  async create({ name, categoryIds, images, attributes, ...rest }: ProductDto): Promise<void> {
    images.forEach((image, idx) => {
      image.orderNo = idx + 1;
    });

    console.log('aaa', rest.productState);

    let slug: string = slugify(name, { lower: true, strict: true, locale: 'vi' });
    const countExistingSlug = await this.productRepository.countBy({ slug });
    slug = countExistingSlug > 0 ? `${slug}-${countExistingSlug}` : slug;

    await this.entityManager.transaction(async (manager) => {
      const product = manager.create(Product, {
        name,
        slug,
        ...rest,
        categories: await this.categoryRepository.findBy({ id: In(categoryIds) }),
        images,
        thumbnailUrl: images[0].url,
      });

      await manager.save(Product, product);

      const attributeValues: ProductAttributeValue[] = [];

      for (const attribute of attributes) {
        const attributeValue = new ProductAttributeValue();
        attributeValue.product = product;
        attributeValue.value = attribute.value;
        attributeValue.attribute = await manager.findOneByOrFail(ProductAttribute, {
          id: attribute.id,
        });

        attributeValues.push(attributeValue);
      }

      await manager.save(ProductAttributeValue, attributeValues);
    });
  }

  async update(
    id: number,
    { name, categoryIds, images, attributes, ...rest }: ProductDto,
  ): Promise<void> {
    const product = await this.productRepository.findOneByOrFail({ id });

    images.forEach((image, idx) => {
      image.orderNo = idx + 1;
    });

    let slug: string = product.slug;
    // Nếu tên sản phẩm thay đổi thì mới tạo slug mới
    if (product.name !== name) {
      slug = slugify(name, { lower: true, strict: true, locale: 'vi' });
      const countExistingSlug = await this.productRepository.countBy({ slug });
      slug = countExistingSlug > 0 ? `${slug}-${countExistingSlug}` : slug;
    }

    await this.entityManager.transaction(async (manager) => {
      await manager.delete(ProductImage, { product: { id } }); // Xóa toàn bộ ảnh của sản phẩm
      await manager.save(Product, {
        ...product,
        name,
        slug,
        ...rest,
        categories: await this.categoryRepository.findBy({ id: In(categoryIds) }),
        images,
        thumbnailUrl: images[0].url,
      });

      const attributeValues: ProductAttributeValue[] = [];

      for (const attribute of attributes) {
        const attributeValue = new ProductAttributeValue();
        attributeValue.product = product;
        attributeValue.value = attribute.value;
        attributeValue.attribute = await manager.findOneByOrFail(ProductAttribute, {
          id: attribute.id,
        });

        attributeValues.push(attributeValue);
      }

      await manager.save(ProductAttributeValue, attributeValues);
    });
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new BadRequestException(`Sản phẩm không tồn tại`);
    }
    await this.productRepository.remove(product);
  }
}
