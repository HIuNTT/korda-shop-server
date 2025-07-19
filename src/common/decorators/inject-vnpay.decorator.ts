import { Inject } from '@nestjs/common';

export const VNPAY_CLIENT = Symbol('VNPAY_CLIENT');

export const InjectVnpay = () => Inject(VNPAY_CLIENT);
