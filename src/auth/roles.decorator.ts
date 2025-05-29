import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const NOT_AUTH_KEY = 'isNotAuth';
export const NotAuth = () => SetMetadata(NOT_AUTH_KEY, true);
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
