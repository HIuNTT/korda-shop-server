import { RedisKeys } from '#/constants/cache.constant';

export function genEmailVerificationCodeKey(email: string) {
  return `${RedisKeys.EMAIL_VERIFICATION_CODE_PREFIX}${email}` as const;
}

export function genVerifiedEmailKey(email: string) {
  return `${RedisKeys.VERIFIED_EMAIL_PREFIX}${email}` as const;
}

export function genTokenBlacklistKey(token: string) {
  return `${RedisKeys.TOKEN_BLACKLIST_PREFIX}${token}` as const;
}
