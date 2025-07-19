import { SetMetadata } from '@nestjs/common';

export const BYPASS_TIMEOUT_KEY = Symbol('__bypass_timeout_key__');
export const BypassTimeout = () => SetMetadata(BYPASS_TIMEOUT_KEY, true);
