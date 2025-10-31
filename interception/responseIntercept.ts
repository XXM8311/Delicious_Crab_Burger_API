import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
interface Data<T> {
  data: T;
}
@Injectable()
export class ResponseIntercept<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          msg: '请求成功',
          time: new Date().toLocaleString(),
          url: req.url,
        };
      }),
    );
  }
}
