import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EntityManager, In, Repository, TreeRepository } from 'typeorm';
import { GetProductAttributesDto, ProductDto } from './dto/product.dto';
import { Category } from '../category/entities/category.entity';
import slugify from 'slugify';
import * as cheerio from 'cheerio';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';
import { ProductAttribute } from '../product-attribute/entites/product-attribute.entity';
import { ProductImage } from './entities/product-image.entity';
import { AttributeGroupHasMap, DefaultAttribute } from './interfaces/attribute.interface';
import { Breadcrumb, ProductBySlug } from './interfaces/product.interface';
import { deleteFields } from '#/utils/tool.util';
import { AzureConfig, IAzureConfig } from '#/config';
import { UploadService } from '../upload/upload.service';
import { ProductAttributeGroupService } from '../product-attribute-group/product-attribute-group.service';
import { InputType } from '#/constants/input-type.constant';
import { ProductAttributeOption } from '../product-attribute/entites/product-attribute-option.entity';
import { ProductImageDto } from './dto/product-image.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(AzureConfig.KEY) private readonly azureConfig: IAzureConfig,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category) private categoryRepository: TreeRepository<Category>,
    @InjectRepository(ProductImage) private productImageRepository: Repository<ProductImage>,
    @InjectEntityManager() private entityManager: EntityManager,
    private uploadService: UploadService,
    private attributeGroupService: ProductAttributeGroupService,
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

  async create({
    name,
    categoryIds,
    images,
    attributes,
    description,
    ...rest
  }: ProductDto): Promise<void> {
    const productImages = images.map((image, idx) => ({
      key: image.key,
      url: this.getImageUrl(image.key),
      orderNo: idx + 1,
    }));

    let slug: string = slugify(name, { lower: true, strict: true, locale: 'vi' });
    const countExistingSlug = await this.productRepository.countBy({ slug });
    slug = countExistingSlug > 0 ? `${slug}-${countExistingSlug}` : slug;

    const descriptionImageKeys: string[] = [];

    const $ = cheerio.load(description, null, false);
    const $img = $('img');
    $img.each((_, element) => {
      const src = $(element).attr('src');
      if (src && src.startsWith(this.getPrefixTempImageUrl())) {
        const key = src.split('/').pop();
        $(element).attr('src', this.getImageUrl(key));
        descriptionImageKeys.push(key);
      }
    });

    const newDescription = $.root().html();

    await this.entityManager.transaction(async (manager) => {
      const product = manager.create(Product, {
        name,
        slug,
        ...rest,
        description: newDescription,
        categories: await this.categoryRepository.findBy({ id: In(categoryIds) }),
        images: productImages,
        thumbnailUrl: productImages[0].url,
      });

      const savedProduct = await manager.save(Product, product);

      const attributeValues: ProductAttributeValue[] = [];
      const attributeValueOptions: ProductAttributeOption[] = [];

      for (const attribute of attributes) {
        const attributeValue = new ProductAttributeValue();
        const attributeEntity = await manager.findOneByOrFail(ProductAttribute, {
          id: attribute.attributeId,
        });

        if (
          [InputType.TEXT_FIELD, InputType.TEXT_AREA].includes(attributeEntity.inputType) &&
          attribute.attributeValues[0]?.rawValue
        ) {
          attributeValue.value = attribute.attributeValues[0].rawValue;
          attributeValue.attribute = attributeEntity;
          attributeValue.product = savedProduct;
          attributeValues.push(attributeValue);
        }

        if (
          [InputType.DROPDOWN, InputType.MULTIPLE_SELECTION].includes(attributeEntity.inputType) &&
          attribute.attributeValues[0]?.optionId
        ) {
          for (const value of attribute.attributeValues) {
            const option = await manager.findOneByOrFail(ProductAttributeOption, {
              id: value.optionId,
            });
            attributeValueOptions.push(option);
          }
        }
      }

      await manager.save(ProductAttributeValue, attributeValues);
      await manager.save(Product, { ...savedProduct, attributeValueOptions });

      await Promise.all([
        ...productImages.map((image) => this.uploadService.moveToPermanentContainer(image.key)),
        ...descriptionImageKeys.map((key) => this.uploadService.moveToPermanentContainer(key)),
      ]);
    });
  }

  async update(
    id: number,
    { name, categoryIds, images, attributes, description, ...rest }: ProductDto,
  ): Promise<void> {
    const product = await this.productRepository.findOneOrFail({
      where: { id },
      relations: {
        images: true,
      },
    });

    const seenImages = new Map<string, number>();

    const productImages = images.map((image, idx) => {
      seenImages.set(image.key, 1); // add image key to seen map
      return {
        key: image.key,
        url: this.getImageUrl(image.key),
        orderNo: idx + 1,
      };
    });

    // Lấy ra các ảnh được loại bỏ khỏi cơ sở dữ liệu trong quá trình cập nhật
    const oldImageKeys = product.images
      .filter((image) => !seenImages.has(image.key))
      .map((image) => image.key);

    let slug: string = product.slug;
    // Nếu tên sản phẩm thay đổi thì mới tạo slug mới
    if (product.name !== name) {
      slug = slugify(name, { lower: true, strict: true, locale: 'vi' });
      const countExistingSlug = await this.productRepository.countBy({ slug });
      slug = countExistingSlug > 0 ? `${slug}-${countExistingSlug}` : slug;
    }

    const seenDescImageKeys = new Map<string, number>();
    const descriptionImageKeys: string[] = [];
    const $ = cheerio.load(description, null, false);
    const $img = $('img');
    $img.each((_, element) => {
      const src = $(element).attr('src');
      if (src && src.startsWith(this.getPrefixTempImageUrl())) {
        const key = src.split('/').pop();
        $(element).attr('src', this.getImageUrl(key));
        descriptionImageKeys.push(key);
        seenDescImageKeys.set(key, 1); // add image key to seen map
      }
      if (src && src.startsWith(this.getPrefixPermanentImageUrl())) {
        // Nếu ảnh đã là permanent thì không cần thay đổi src
        const key = src.split('/').pop();
        seenDescImageKeys.set(key, 1); // add image key to seen map
      }
    });

    const newDescription = $.root().html();

    // Get all images in old description
    const oldDescImageKeys: string[] = [];
    const $oldDesc = cheerio.load(product.description, null, false);
    const $oldImg = $oldDesc('img');
    $oldImg.each((_, element) => {
      const src = $oldDesc(element).attr('src');
      if (src && src.startsWith(this.getPrefixPermanentImageUrl())) {
        const key = src.split('/').pop();
        oldDescImageKeys.push(key);
      }
    });

    await this.entityManager.transaction(async (manager) => {
      await manager.delete(ProductImage, { product: { id } }); // Xóa toàn bộ ảnh của sản phẩm trong CSDL để update toàn bộ lại
      const savedProduct = await manager.save(Product, {
        ...product,
        name,
        slug,
        ...rest,
        description: newDescription,
        categories: await this.categoryRepository.findBy({ id: In(categoryIds) }),
        images: productImages,
        thumbnailUrl: productImages[0].url,
      });

      const attributeValues: ProductAttributeValue[] = [];
      const attributeValueOptions: ProductAttributeOption[] = [];

      for (const attribute of attributes) {
        const attributeValue = new ProductAttributeValue();
        const attributeEntity = await manager.findOneByOrFail(ProductAttribute, {
          id: attribute.attributeId,
        });

        if (
          [InputType.TEXT_FIELD, InputType.TEXT_AREA].includes(attributeEntity.inputType) &&
          attribute.attributeValues[0]?.rawValue
        ) {
          attributeValue.value = attribute.attributeValues[0].rawValue;
          attributeValue.attribute = attributeEntity;
          attributeValue.product = savedProduct;
          attributeValues.push(attributeValue);
        }

        if (
          [InputType.DROPDOWN, InputType.MULTIPLE_SELECTION].includes(attributeEntity.inputType) &&
          attribute.attributeValues[0]?.optionId
        ) {
          for (const value of attribute.attributeValues) {
            const option = await manager.findOneByOrFail(ProductAttributeOption, {
              id: value.optionId,
            });
            attributeValueOptions.push(option);
          }
        }
      }

      await manager.save(ProductAttributeValue, attributeValues);
      await manager.save(Product, { ...savedProduct, attributeValueOptions });

      await Promise.all([
        ...productImages
          .filter((image) => image.key.startsWith(this.getPrefixTempImageUrl()))
          .map((image) => this.uploadService.moveToPermanentContainer(image.key)),
        ...descriptionImageKeys.map((key) => this.uploadService.moveToPermanentContainer(key)),

        // Delete old images in the database that are no longer in use
        ...oldImageKeys.map((key) => this.uploadService.moveToTemporaryContainer(key)),
        ...oldDescImageKeys
          .filter((key) => !seenDescImageKeys.has(key))
          .map((key) => this.uploadService.moveToTemporaryContainer(key)),
      ]);
    });
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new BadRequestException(`Sản phẩm không tồn tại`);
    }
    await this.productRepository.remove(product);
  }

  async getAttributesByCategory({ categoryIds }: GetProductAttributesDto) {
    const categoryIdList = [];

    for (const categoryId of categoryIds) {
      const category = await this.categoryRepository.findOneByOrFail({ id: categoryId });
      const ancestors = await this.categoryRepository
        .createAncestorsQueryBuilder('category', 'categoryClosure', category)
        .select(['category.id'])
        .getMany();

      ancestors.forEach((ancestor) => categoryIdList.push(ancestor.id));
    }

    return await this.attributeGroupService.getAttributeByCategory(categoryIdList);
  }

  /** Get permanent image url */
  private getImageUrl(key: string): string {
    return `https://${this.azureConfig.accountName}.blob.${this.azureConfig.endpointSuffix}/${this.azureConfig.imagesContainerName}/${key}`;
  }

  private getPrefixTempImageUrl() {
    return `https://${this.azureConfig.accountName}.blob.${this.azureConfig.endpointSuffix}/${this.azureConfig.tempContainerName}/`;
  }

  private getPrefixPermanentImageUrl() {
    return `https://${this.azureConfig.accountName}.blob.${this.azureConfig.endpointSuffix}/${this.azureConfig.imagesContainerName}/`;
  }
}
