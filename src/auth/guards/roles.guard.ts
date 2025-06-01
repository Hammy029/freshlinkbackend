// src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get roles metadata set by @Roles() decorator on the route or controller
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
  context.getHandler(),
  context.getClass(),
]);

    if (!requiredRoles) {
      // If no roles are specified, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user's role matches one of the required roles
    return requiredRoles.includes(user.role);
  }
}
