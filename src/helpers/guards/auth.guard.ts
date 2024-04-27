import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { isPublic } from 'src/helpers/decorators/is-public.decorator';
import { ApiException } from '../exceptions/api.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublicRoute = this.reflector.get<boolean>(
      isPublic,
      context.getHandler(),
    );

    if (isPublicRoute) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ApiException({ key: 'UNAUTHORIZED' }, 'UNAUTHORIZED');
    }

    try {
      const payload = await this.jwtService.verify(token);

      request['user'] = payload;
    } catch {
      throw new ApiException({ key: 'UNAUTHORIZED' }, 'UNAUTHORIZED');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
