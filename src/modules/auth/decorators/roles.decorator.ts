import { RoleType } from '#/constants/role.constant';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = '__roles_key__';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
