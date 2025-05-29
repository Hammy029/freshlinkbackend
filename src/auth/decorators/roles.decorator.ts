// src/auth/decorators/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { Role } from '../roles.enum';

// Key for roles metadata, can be any string but keep consistent
export const ROLES_KEY = 'roles';

// Roles decorator accepts one or more roles and sets metadata
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
