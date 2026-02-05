import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (!session?.user) {
      // Throw UnauthorizedException - will be caught by GlobalExceptionFilter
      // and redirect to /users/login
      throw new UnauthorizedException('Please login to access this resource');
    }

    return true;
  }
}
