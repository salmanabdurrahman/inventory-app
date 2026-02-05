import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const session = request.session;

    if (!session?.user) {
      response.redirect('/users/login');
      return false;
    }

    return true;
  }
}
