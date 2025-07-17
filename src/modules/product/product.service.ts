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
import { Breadcrumb, ProductBySlug, ProductVersion, Variant } from './interfaces/product.interface';
import { deleteFields } from '#/utils/tool.util';
import { AzureConfig, IAzureConfig } from '#/config';
import { UploadService } from '../upload/upload.service';
import { ProductAttributeGroupService } from '../product-attribute-group/product-attribute-group.service';
import { InputType } from '#/constants/input-type.constant';
import { ProductAttributeOption } from '../product-attribute/entites/product-attribute-option.entity';
import { ProductGroup } from '../product-group/product-group.entity';
import { ProductVariant } from '../product-variant/entities/product-variant.entity';
import { ProductVariantOption } from '../product-variant/entities/product-variant-option.entity';
import { isEmpty } from 'lodash';

@Injectable()
export class ProductService {
  constructor(
    @Inject(AzureConfig.KEY) private readonly azureConfig: IAzureConfig,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category) private categoryRepository: TreeRepository<Category>,
    @InjectRepository(ProductImage) private productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductGroup) private productGroupRepository: Repository<ProductGroup>,
    @InjectRepository(ProductVariant) private productVariantRepository: Repository<ProductVariant>,
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

  async getProductBySlug(slug: string): Promise<ProductBySlug> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: {
        categories: true,
        attributes: {
          attribute: {
            group: true,
          },
        },
        attributeValueOptions: {
          attribute: {
            group: true,
          },
        },
        group: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Sản phẩm không tồn tại`);
    }

    const productVersions: ProductVersion[] = [];

    if (product.group?.id) {
      const [productOfGroup] = await this.productGroupRepository.find({
        where: { id: product.group?.id },
        relations: {
          products: true,
        },
        select: {
          products: {
            slug: true,
            relatedName: true,
            price: true,
          },
        },
      });
      if (productOfGroup) {
        productVersions.push(
          ...productOfGroup.products.map((p) => ({
            name: p.relatedName,
            slug: p.slug,
            price: p.price,
          })),
        );
      }
    }

    const variantList = await this.productVariantRepository.find({
      where: { product: { id: product.id } },
      relations: {
        variantValues: true,
      },
    });

    const minPrice = Math.min(...variantList.map((variant) => variant.price));

    const variants: Variant[] = [];
    let isCheck = false;
    for (const variant of variantList) {
      variants.push({
        id: variant.id,
        imageUrl: variant.imageUrl || '',
        color: variant.variantValues?.[0].name || '', // Giả sử chỉ có một giá trị màu sắc
        price: variant.price,
        originalPrice: variant.originalPrice,
        discountPercent:
          variant.originalPrice > 0
            ? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)
            : 0,
        stock: variant.stock,
        isDefault: !isCheck && variant.price === minPrice,
      });

      if (variant.price === minPrice) {
        isCheck = true;
      }
    }

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
        key: true,
        url: true,
        orderNo: true,
      },
      where: { product: { id: product.id } },
      order: { orderNo: 'ASC' },
    });

    const defaultAttributes: DefaultAttribute[] = [];
    const attributesMap = new Map<number, AttributeGroupHasMap>();

    // Format lại danh sách thuộc tính thuộc loại text field, textarea
    product.attributes.forEach((attribute) => {
      const group = attribute.attribute.group;
      const attributeId = attribute.attributeId;
      const attributeValue = attribute.value;
      const attributeName = attribute.attribute.name;
      const attributeOrderNo = attribute.attribute.orderNo;

      const isDefaultAttribute = attribute.attribute.isSelected && attribute.attribute.isDisplay;
      if (isDefaultAttribute) {
        defaultAttributes.push({
          name: attributeName,
          value: attributeValue,
          orderNo: attributeOrderNo,
        });
      }

      if (!attributesMap.has(group.id) && attribute.attribute.isDisplay) {
        attributesMap.set(group.id, {
          groupName: group.name,
          orderNo: group.orderNo,
          attributes: [],
        });
      }

      if (attribute.attribute.isDisplay) {
        attributesMap.get(group.id).attributes.push({
          id: attributeId,
          name: attributeName,
          orderNo: attributeOrderNo,
          value: attributeValue,
        });
      }
    });

    const attributeOptionTypes = new Map<
      number,
      {
        attributeId: number;
        attributeName: string;
        attributeOrderNo: number;
        isSelected: boolean;
        groupId: number;
        values: string[];
      }
    >();
    // Format lại danh sách thuộc tính thuộc loại dropdown, multiple selection, gộp các giá trị của thuộc tính vào một mảng
    product.attributeValueOptions.forEach((attributeOption) => {
      const group = attributeOption.attribute.group;
      const attributeId = attributeOption.attribute.id;
      const optionName = attributeOption.name;

      if (!attributeOptionTypes.has(attributeId) && attributeOption.attribute.isDisplay) {
        attributeOptionTypes.set(attributeId, {
          attributeId: attributeId,
          attributeName: attributeOption.attribute.name,
          attributeOrderNo: attributeOption.attribute.orderNo,
          isSelected: attributeOption.attribute.isSelected,
          groupId: group.id,
          values: [],
        });
      }

      if (attributeOption.attribute.isDisplay) {
        attributeOptionTypes.get(attributeId).values.push(optionName);
      }

      if (!attributesMap.has(group.id) && attributeOption.attribute.isDisplay) {
        attributesMap.set(group.id, {
          groupName: group.name,
          orderNo: group.orderNo,
          attributes: [],
        });
      }
    });

    for (const att of attributeOptionTypes.values()) {
      attributesMap.get(att.groupId).attributes.push({
        id: att.attributeId,
        name: att.attributeName,
        orderNo: att.attributeOrderNo,
        value: att.values.join(', '),
      });

      if (att.isSelected) {
        defaultAttributes.push({
          name: att.attributeName,
          value: att.values.join(', '),
          orderNo: att.attributeOrderNo,
        });
      }
    }

    // Sắp xếp danh sách thuộc tính theo thứ tự hiển thị
    const resultAttributes = Array.from(attributesMap.values())
      .map((item) => {
        item.attributes.sort((a, b) => a.orderNo - b.orderNo);
        return item;
      })
      .sort((a, b) => a.orderNo - b.orderNo);

    deleteFields(product, [
      'ratingSum',
      'attributes',
      'attributeValueOptions',
      'group',
      'variants',
    ]);

    return new ProductBySlug({
      ...product,
      discountPercent,
      aggregateRating,
      images: listImages,
      defaultAttributes,
      attributeItems: resultAttributes,
      breadcrumbs,
      productVersions,
      variants,
    });
  }

  async create({
    name,
    categoryIds,
    images,
    attributes,
    description,
    variantValues,
    variationList,
    groupId,
    ...rest
  }: ProductDto): Promise<void> {
    const productImages = images.map((image, idx) => ({
      key: image.key,
      url: this.uploadService.getImageUrl(image.key),
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
      if (src && src.startsWith(this.uploadService.getPrefixTempImageUrl())) {
        const key = src.split('/').pop();
        $(element).attr('src', this.uploadService.getImageUrl(key));
        descriptionImageKeys.push(key);
      }
    });

    const newDescription = $.root().html();

    let price: number;
    let originalPrice: number;
    let stock: number;

    if (isEmpty(variationList)) {
      price = variantValues[0].price;
      originalPrice = variantValues[0].originalPrice;
      stock = variantValues[0].stock;
    }
    if (!isEmpty(variationList) && !isEmpty(variantValues)) {
      let minPrice = variantValues[0].price;
      let minOriginalPrice = variantValues[0].originalPrice;
      let totalStock = variantValues[0].stock;

      for (let i = 1; i < variantValues.length; i++) {
        const variant = variantValues[i];
        if (variant.price < minPrice) {
          minPrice = variant.price;
        }
        if (variant.originalPrice < minOriginalPrice) {
          minOriginalPrice = variant.originalPrice;
        }
        totalStock += variant.stock;
      }

      price = minPrice;
      originalPrice = minOriginalPrice;
      stock = totalStock;
    }

    await this.entityManager.transaction(async (manager) => {
      const product = manager.create(Product, {
        name,
        slug,
        ...rest,
        description: newDescription,
        categories: await this.categoryRepository.findBy({ id: In(categoryIds) }),
        group: groupId && (await this.productGroupRepository.findOneBy({ id: groupId })),
        images: productImages,
        thumbnailUrl: productImages[0].url,
        price,
        originalPrice,
        stock,
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

      // Lưu các biến thể sản phẩm nếu có
      const variantImageKeys: string[] = [];
      const variants: ProductVariant[] = [];
      if (!isEmpty(variationList) && !isEmpty(variantValues)) {
        for (const variantValue of variantValues) {
          const variant = new ProductVariant();
          variant.product = savedProduct;
          variant.price = variantValue.price;
          variant.originalPrice = variantValue.originalPrice;
          variant.stock = variantValue.stock;
          variant.imageUrl = this.uploadService.getImageUrl(variantValue.image.key);

          variantImageKeys.push(variantValue.image.key);

          const varCombIds = variantValue.indexMap.map(
            (idxMap, index) => variationList[index].valueList[idxMap].valueId,
          );
          const variantValues = await manager.findBy(ProductVariantOption, { id: In(varCombIds) });
          variant.variantValues = variantValues;
          variant.name = [product.name, ...variantValues.map((v) => v.name)].join(' - ');

          variants.push(variant);
        }
      }
      if (isEmpty(variationList) && !isEmpty(variantValues)) {
        const variant = new ProductVariant();
        variant.product = savedProduct;
        variant.price = price;
        variant.originalPrice = originalPrice;
        variant.stock = stock;
        variant.name = savedProduct.name;

        variants.push(variant);
      }

      await manager.save(ProductVariant, variants);

      await Promise.all([
        ...productImages.map((image) => this.uploadService.moveToPermanentContainer(image.key)),
        ...descriptionImageKeys.map((key) => this.uploadService.moveToPermanentContainer(key)),
        ...variantImageKeys.map((key) => this.uploadService.moveToPermanentContainer(key)),
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
        url: this.uploadService.getImageUrl(image.key),
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
      if (src && src.startsWith(this.uploadService.getPrefixTempImageUrl())) {
        const key = src.split('/').pop();
        $(element).attr('src', this.uploadService.getImageUrl(key));
        descriptionImageKeys.push(key);
        seenDescImageKeys.set(key, 1); // add image key to seen map
      }
      if (src && src.startsWith(this.uploadService.getPrefixPermanentImageUrl())) {
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
      if (src && src.startsWith(this.uploadService.getPrefixPermanentImageUrl())) {
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
          .filter((image) => image.key.startsWith(this.uploadService.getPrefixTempImageUrl()))
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
}
