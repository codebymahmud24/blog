import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';

export const AuthorizeGuard = (allowedRoles: string[]) => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const userRoles: string[] = request?.currentUser?.role || [];

      const hasRole = userRoles.some((role) => allowedRoles.includes(role));

      if (hasRole) return true;

      throw new UnauthorizedException('Sorry, you are not authorised.');
    }
  }

  return mixin(RoleGuardMixin); // mixin returns a class constructor
};
