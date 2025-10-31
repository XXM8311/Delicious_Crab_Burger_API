import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class LogInterceptor implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 日志记录 - 生产环境应使用专业日志系统（如Winston、Pino）
    // 避免记录包含敏感信息的完整URL
    next();
  }
}
