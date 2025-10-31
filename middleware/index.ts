import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class LogInterceptor implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('请求路径', req.url);
    next();
  }
}
