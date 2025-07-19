import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import { UploadService } from '#/modules/upload/upload.service';
import { PaymentMethodDto } from './dto/payment-method.dto';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod) private paymentMethodRepository: Repository<PaymentMethod>,
    private uploadService: UploadService,
  ) {}

  async findOneById(id: number): Promise<PaymentMethod> {
    return await this.paymentMethodRepository.findOneByOrFail({ id });
  }

  async getAll(): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find({
      select: {
        id: true,
        name: true,
        key: true,
        imageUrl: true,
        isActived: true,
      },
      order: { orderNo: 'ASC' },
    });
  }

  async create({ image, ...dto }: PaymentMethodDto): Promise<void> {
    const imageUrl = this.uploadService.getIconUrl(image.key);
    await this.paymentMethodRepository.insert({
      ...dto,
      imageUrl,
    });
    await this.uploadService.moveToIconContainer(image.key);
  }

  async update(id: number, { image, ...dto }: PaymentMethodDto): Promise<void> {
    const method = await this.paymentMethodRepository.findOneByOrFail({ id });
    const imageUrl = this.uploadService.getIconUrl(image.key);

    await this.paymentMethodRepository.save({
      ...method,
      ...dto,
      imageUrl,
    });

    if (imageUrl !== method.imageUrl) {
      await this.uploadService.moveToIconContainer(image.key);
      await this.uploadService.moveToTemporaryFromIconContainer(
        this.uploadService.getKeyFromUrl(method.imageUrl),
      );
    }
  }

  async delete(id: number): Promise<void> {
    const method = await this.paymentMethodRepository.findOneByOrFail({ id });
    await this.paymentMethodRepository.remove(method);
    await this.uploadService.moveToTemporaryFromIconContainer(
      this.uploadService.getKeyFromUrl(method.imageUrl),
    );
  }
}
