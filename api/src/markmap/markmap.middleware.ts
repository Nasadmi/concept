import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class MarkmapMiddleware implements NestMiddleware {
  use(req: Request<>, res: any, next: () => void) {
    req.body.user = req.headers.bearer;
    next();
  }
}
