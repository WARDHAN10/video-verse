import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly validToken = process.env.AUTH_TOKEN || 'sh28NyMUIcFMFrkwA4ticgXUWGdp3fKNxbrXIFqDJikzYYICmN';

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token =request.headers['x-auth-token'];
    if (!token || token !== this.validToken) {
      throw new ForbiddenException('Invalid token');
    }
    return true;
  }
}