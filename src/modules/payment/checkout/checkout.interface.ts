import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckoutRes {
  @ApiProperty({ description: 'True/False if checkout is successful' })
  success: boolean;

  @ApiProperty({ description: 'Message for the checkout process' })
  message: string;

  @ApiProperty({ description: 'Generic information about the checkout' })
  spec: string;

  @ApiProperty({ description: 'Generic message for the checkout' })
  generic: string;

  @Expose({ name: 'order_code' })
  orderCode: string;

  constructor(partial?: Partial<CheckoutRes>) {
    Object.assign(this, partial);
  }
}
