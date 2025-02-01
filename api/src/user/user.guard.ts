/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const bearer = request.headers.bearer as string;

      if (!bearer || bearer.trim() === '') {
        return false;
      }

      try {
        const decoded = this.jwtService.verify(bearer);
        request.headers.bearer = decoded;
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
