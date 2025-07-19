import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = Symbol('__public_key__');
export const Public = () => SetMetadata(PUBLIC_KEY, true);
