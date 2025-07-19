import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransferPaymentDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  gateway: string;

  @IsString()
  @IsNotEmpty()
  transactionDate: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  transferType: string;

  @IsNumber()
  transferAmount: number;

  @IsNumber()
  accumulated: number;

  @IsString()
  @IsNotEmpty()
  referenceCode: string;
}
