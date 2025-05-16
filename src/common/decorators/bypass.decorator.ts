import { SetMetadata } from '@nestjs/common';

export const BYPASS_KEY = '__bypass_key__';
export const Bypass = () => SetMetadata(BYPASS_KEY, true);
