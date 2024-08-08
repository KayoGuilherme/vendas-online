import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly Reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.Reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    const rolesFiltered = requiredRoles.some(
      (role: number) => role <= user.role,
    );

    return rolesFiltered;
  }
}
