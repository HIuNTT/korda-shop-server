import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class VnpayPaymentDto {
  @IsString()
  @IsNotEmpty()
  vnp_TmnCode: string;

  @IsNumber()
  vnp_Amount: number;

  @IsString()
  @IsNotEmpty()
  vnp_BankCode: string;

  @IsString()
  @IsOptional()
  vnp_BankTranNo?: string;

  @IsString()
  @IsOptional()
  vnp_CardType?: string;

  @IsNumber()
  @IsOptional()
  vnp_PayDate?: number;

  @IsString()
  @IsNotEmpty()
  vnp_OrderInfo: string;

  @IsNumber()
  vnp_TransactionNo: number;

  @IsString()
  @IsNotEmpty()
  vnp_ResponseCode: string;

  @IsString()
  @IsNotEmpty()
  vnp_TransactionStatus: string;

  @IsString()
  @IsNotEmpty()
  vnp_TxnRef: string;

  @IsString()
  @IsNotEmpty()
  vnp_SecureHash: string;
}
